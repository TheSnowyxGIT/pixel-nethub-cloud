"use client";

import { deleteFont, downloadFont, getFont } from "@/apis/fonts";
import { Font } from "@/models/Font";
import { useEffect, useRef, useState } from "react";
import * as t2m from "text2matrix";
import { LoadingScreen } from "@/components/loading-screen";
import C_Breadcrumbs, {
  C_LinkBreadcrumbs,
} from "@/components/mui/C_Breadcrumbs";
import FontPreview from "@/components/fonts/font-preview";
import C_BoxHeader from "@/components/basics/C_BoxHeader";
import C_Button from "@/components/mui/C_Button";
import C_DeleteFontDialog from "@/components/C_DeleteFontDialog";
import { useRouter } from "next/navigation";
import C_Container from "@/components/basics/C_Container";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

export default function FontEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fontData, setFontData] = useState<Font | null>(null);

  const [fontSize, setFontSize] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fontLoader = async () => {
      const font = await getFont(params.id);
      setFontData(font);
      setFontSize(font.fontSize ?? 5);
      setLetterSpacing(font.letterSpacing ?? 0);

      const fontAlreadyLoaded = t2m.hasFont(font.hash);
      // ? Here the font set is always empty, there no cache
      if (!fontAlreadyLoaded) {
        console.log("Downloading font...");
        const blob = await downloadFont(font.id);
        await t2m.addFont(await blob.arrayBuffer(), font.hash);
      }
      setLoading(false);
    };
    fontLoader();
  }, []);

  if (loading) {
    return (
      <>
        <LoadingScreen text="Downloading font..." />
      </>
    );
  }

  return (
    <main className="min-h-screen relative">
      <SnackbarProvider />
      <C_DeleteFontDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={async () => {
          try {
            await deleteFont(fontData!.id);
            enqueueSnackbar("Font deleted", { variant: "success" });
            router.push("/fonts");
          } catch (e) {
            console.error(e);
            enqueueSnackbar("Failed to delete font", { variant: "error" });
          }
        }}
        name={fontData?.name ?? ""}
      />
      <header className="bg-background-200 border-b-[1px] border-bs-gray-alpha-400 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <C_LinkBreadcrumbs
            className="pb-2"
            links={[
              { href: "/fonts", text: "Fonts" },
              { href: "", text: fontData!.name.toLowerCase() },
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
        </div>
      </header>

      <div className="bg-background-200 px-6 py-12">
        <C_Container>
          <div className="mb-4 gap-2 flex justify-end">
            <C_Button
              onClick={() => {
                router.push(`/fonts/edit/${params.id}`);
              }}
            >
              Edit
            </C_Button>
            <C_Button
              onClick={() => setDeleteDialogOpen(true)}
              disabled={fontData?.required}
            >
              Delete
            </C_Button>
          </div>

          <div className="mb-4">
            <FontPreview
              fontHash={fontData?.hash ?? null}
              fontSettings={{ fontSize, letterSpacing }}
            />
          </div>

          <C_BoxHeader title="Font Information">
            <div className="flex flex-col">
              <dl>
                <dt className="text-bs-gray-900 text-sm">Id</dt>
                <dd className="text-bs-gray-1000 text-sm font-medium">
                  {fontData?.id}
                </dd>
              </dl>
              <dl>
                <dt className="text-bs-gray-900 text-sm">Required</dt>
                <dd className="text-bs-gray-1000 text-sm font-medium">
                  {fontData?.required ? "Yes" : "No"}
                </dd>
              </dl>
              <dl>
                <dt className="text-bs-gray-900 text-sm">Font file hash</dt>
                <dd className="text-bs-gray-1000 text-sm font-medium">
                  {fontData?.hash}
                </dd>
              </dl>
              <dl>
                <dt className="text-bs-gray-900 text-sm">Current font size</dt>
                <dd className="text-bs-gray-1000 text-sm font-medium">
                  {fontData?.fontSize ?? "auto"}
                </dd>
              </dl>
              <dl>
                <dt className="text-bs-gray-900 text-sm">
                  Current letter spacing
                </dt>
                <dd className="text-bs-gray-1000 text-sm font-medium">
                  {fontData?.letterSpacing ?? "0"}
                </dd>
              </dl>
            </div>
          </C_BoxHeader>
        </C_Container>
      </div>
    </main>
  );
}
