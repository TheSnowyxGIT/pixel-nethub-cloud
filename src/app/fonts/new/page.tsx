"use client";

import { uploadFont } from "@/apis/fonts";
import C_BoxHeader from "@/components/basics/C_BoxHeader";
import FontPreview from "@/components/fonts/font-preview";
import FontSettingBox from "@/components/fonts/font-setting-box";
import C_Breadcrumbs, {
  C_LinkBreadcrumbs,
} from "@/components/mui/C_Breadcrumbs";
import C_Button from "@/components/mui/C_Button";
import C_FileInput from "@/components/mui/C_FileInput";
import C_NumberInput from "@/components/mui/C_NumberInput";
import C_TextInput from "@/components/mui/C_TextImput";
import { Font, FontSettings, NewFontData } from "@/models/Font";
import { Label, Try } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import Link from "@mui/material/Link";
import { MuiFileInput } from "mui-file-input";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { use, useEffect, useMemo, useState } from "react";
import * as t2m from "text2matrix";
import { useRouter } from "next/navigation";
import C_Container from "@/components/basics/C_Container";

export default function NewFont() {
  const router = useRouter();

  const [fontDefaultSettings, setFontDefaultSettings] = useState<FontSettings>({
    fontSize: 8,
    letterSpacing: 0,
  });

  const [fontSettings, setFontSettings] = useState<FontSettings>({
    fontSize: 8,
    letterSpacing: 0,
  });
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const [fontHash, setFontHash] = useState<string | null>(null);
  const [isVerifyingFile, setIsVerifyingFile] = useState(false);

  const verificationData = () => {
    if (!file) return false;
    if (!name) return false;
    if (!fontHash) return false;
    if (!fontSettings) return false;
    if (fontSettings.fontSize < 1) return false;
    return true;
  };

  const handleAddFont = async () => {
    if (!verificationData()) {
      enqueueSnackbar(`Please fill correctly the input fields`, {
        variant: "error",
      });
      return;
    }
    const newFontData: NewFontData = {
      name,
      file: file!,
      ...fontSettings,
    };
    try {
      await uploadFont(newFontData);
      enqueueSnackbar(`The font '${name}' has been uploaded.`, {
        variant: "success",
      });
      router.push("/fonts");
    } catch (e) {
      enqueueSnackbar(`An error occured while uploading the font.`, {
        variant: "error",
      });
      console.error(e);
      return;
    }
  };

  useEffect(() => {
    if (!file) {
      setFontHash(null);
    } else {
      setIsVerifyingFile(true);
      file.arrayBuffer().then(async (buffer) => {
        try {
          const hash = await t2m.addFont(buffer);
          const size = t2m.estimateFontSize(hash, 8);
          setFontDefaultSettings({
            ...fontSettings,
            letterSpacing: 0,
            fontSize: size,
          });
          setFontHash(hash);
          enqueueSnackbar(
            `The preview of the font '${file.name}' should be available.`,
            {
              variant: "info",
            }
          );
        } catch (e) {
          enqueueSnackbar(`Please select a valid font.`, {
            variant: "error",
          });
          setFile(undefined);
        }
        setIsVerifyingFile(false);
      });
    }
  }, [file]);

  useEffect(() => {
    setFontSettings({ ...fontDefaultSettings });
  }, [fontDefaultSettings]);

  return (
    <main className="min-h-screen relative">
      <SnackbarProvider />
      <div className="bg-background-200 px-6 py-12">
        <C_Container>
          <C_LinkBreadcrumbs
            className="pb-2"
            links={[
              { href: "/fonts", text: "Fonts" },
              { href: "", text: "Create new font" },
            ]}
          />
          <div className="flex justify-start items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold"> Create new font</h1>
            </div>
          </div>

          <C_BoxHeader title="Font Information" className="">
            <C_TextInput
              label="Font name"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </C_BoxHeader>

          <C_BoxHeader title="Font Selection" className="mt-4">
            <C_FileInput
              label="Load Font"
              selectedFile={file}
              setSelectedFile={setFile}
              disabled={isVerifyingFile}
            />
          </C_BoxHeader>

          <FontSettingBox
            className="mt-4"
            values={fontSettings}
            onChange={setFontSettings}
            defaultValues={fontDefaultSettings}
          />

          <div className="mt-4">
            <FontPreview fontHash={fontHash} fontSettings={fontSettings} />
          </div>

          <div className="mt-4 flex justify-end">
            <C_Button onClick={handleAddFont}>Add Font</C_Button>
          </div>
        </C_Container>
      </div>
    </main>
  );
}
