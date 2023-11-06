"use client";

import { downloadFont, getFont, updateFont } from "@/apis/fonts";
import { Font, FontSettings } from "@/models/Font";
import { use, useEffect, useRef, useState } from "react";
import * as t2m from "text2matrix";
import { LoadingScreen } from "@/components/loading-screen";
import C_Breadcrumbs, {
  C_LinkBreadcrumbs,
} from "@/components/mui/C_Breadcrumbs";
import { EditAttributes, EditCalendar } from "@mui/icons-material";
import FontPreview from "@/components/fonts/font-preview";
import C_NumberInput from "@/components/mui/C_NumberInput";
import C_Box from "@/components/basics/C_Box";
import C_BoxHeader from "@/components/basics/C_BoxHeader";
import C_Button from "@/components/mui/C_Button";
import C_DeleteFontDialog from "@/components/C_DeleteFontDialog";
import FontSettingBox from "@/components/fonts/font-setting-box";
import Link from "next/link";
import C_Container from "@/components/basics/C_Container";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function FontEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fontData, setFontData] = useState<Font | null>(null);

  const [fontDefaultSettings, setFontDefaultSettings] = useState<FontSettings>({
    fontSize: 8,
    letterSpacing: 0,
  });
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    fontSize: 8,
    letterSpacing: 0,
  });

  useEffect(() => {
    const fontLoader = async () => {
      const font = await getFont(params.id);
      setFontDefaultSettings(font);
      const fontAlreadyLoaded = t2m.hasFont(font.hash);
      // ? Here the font set is always empty, there no cache
      if (!fontAlreadyLoaded) {
        const blob = await downloadFont(font.id);
        await t2m.addFont(await blob.arrayBuffer(), font.hash);
        console.log("Downloading font...");
      }
      setFontData(font);
      setLoading(false);
    };
    fontLoader();
  }, []);

  useEffect(() => {
    setFontSettings(fontDefaultSettings);
  }, [fontDefaultSettings]);

  const verificationData = () => {
    if (!fontSettings) return false;
    if (fontSettings.fontSize < 1) return false;
    return true;
  };

  const handleUpdateFont = async () => {
    if (!verificationData()) {
      enqueueSnackbar(`Please fill correctly the input fields`, {
        variant: "error",
      });
      return;
    }

    try {
      await updateFont(params.id, fontSettings);
      enqueueSnackbar(`The font ${fontData!.name} has been updated`, {
        variant: "success",
      });
      router.push(`/fonts/details/${params.id}`);
    } catch (e) {
      enqueueSnackbar(`An error occurred while updating the font.`, {
        variant: "error",
      });
      console.error(e);
      return;
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading font..." />;
  }

  return (
    <main className="min-h-screen relative">
      <SnackbarProvider />

      <header className="bg-background-200 border-b-[1px] border-bs-gray-alpha-400 px-6 py-12">
        <C_Container>
          <C_LinkBreadcrumbs
            className="pb-2"
            links={[
              { href: "/fonts", text: "Fonts" },
              {
                href: `/fonts/details/${params.id}`,
                text: fontData!.name.toLowerCase(),
              },
              { href: "", text: "Edit Font" },
            ]}
          />

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold uppercase">{fontData?.name}</h1>
            </div>
            <div className="flex items-center text-bs-gray-900">
              <span>2.0.1</span>
              <span className="px-1 text-bs-gray-1000">•</span>
              <span>Created 2 month ago</span>
            </div>
          </div>
        </C_Container>
      </header>

      <div className="bg-background-200 px-6 py-12">
        <C_Container>
          <div className="flex justify-start items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold"> Edit font</h1>
            </div>
          </div>

          <FontSettingBox
            className="mb-4"
            values={fontSettings}
            onChange={setFontSettings}
            defaultValues={fontDefaultSettings}
          />

          <div className="">
            <FontPreview
              fontHash={fontData?.hash ?? null}
              fontSettings={fontSettings}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <C_Button onClick={handleUpdateFont}>Update Font</C_Button>
          </div>
        </C_Container>
      </div>
    </main>
  );
}
