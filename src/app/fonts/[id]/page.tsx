"use client";

import { downloadFont, getFont } from "@/apis/fonts";
import { Font } from "@/models/Font";
import { useEffect, useRef, useState } from "react";
import * as t2m from "text2matrix";
import Link from "@mui/material/Link";
import { LoadingScreen } from "@/components/loading-screen";
import C_Breadcrumbs from "@/components/mui/C_Breadcrumbs";
import { EditAttributes, EditCalendar } from "@mui/icons-material";
import FontPreview from "@/components/fonts/font-preview";

export default function FontEdit({ params }: { params: { id: string } }) {
  const screenRef = useRef<FontPreview>(null);

  const [loading, setLoading] = useState(true);
  const [fontData, setFontData] = useState<Font | null>(null);

  const [fontSize, setFontSize] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);

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

  useEffect(() => {
    if (!loading) {
      screenRef.current?.restart({
        fontSize,
        letterSpacing,
      });
    }
  }, [fontSize, letterSpacing, loading]);

  return (
    <main className="min-h-screen relative">
      {loading && <LoadingScreen text="Downloading font..." />}
      <header className="bg-background-200 border-b-[1px] border-bs-gray-alpha-400 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <C_Breadcrumbs className="pb-2">
            <Link underline="hover" color="inherit" href="/fonts">
              Fonts
            </Link>
            <Link underline="hover" color="var(--bs-gray-1000)" href="">
              {fontData?.name.toLowerCase()}
            </Link>
          </C_Breadcrumbs>
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
        <div className="max-w-6xl mx-auto">
          <div className="pb-6">
            <div>
              <div className="pb-2">
                <h3 className="text-xl font-semibold">Font data</h3>
              </div>
              <p className="text-bs-gray-900 text-sm">
                Ut occaecat consectetur ex aliqua non consectetur ut.
              </p>
            </div>
            <div className="mt-6 p-4 bg-background-100 border-[1px] border-bs-gray-alpha-400 rounded-md shadow-sm">
              <div className="flex flex-col">
                <dl>
                  <dt className="text-bs-gray-900 text-sm">Id</dt>
                  <dd className="text-bs-gray-1000 text-sm font-medium">
                    {fontData?.id}
                  </dd>
                </dl>
                <dl>
                  <dt className="text-bs-gray-900 text-sm">Font file hash</dt>
                  <dd className="text-bs-gray-1000 text-sm font-medium">
                    {fontData?.hash}
                  </dd>
                </dl>
                <dl>
                  <dt className="text-bs-gray-900 text-sm">
                    Current font size
                  </dt>
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
            </div>
          </div>

          <div className="pb-6">
            <div>
              <div className="pb-2">
                <h4 className="text-xl font-semibold">Edit Font</h4>
              </div>
              <p className="text-bs-gray-900 text-sm">
                Edit the font settings.
              </p>
            </div>
            <div className="py-4">
              <div className="flex flex-col gap-3">
                <div>
                  <span>Font Size</span>
                  <div className="flex w-full">
                    <C_NumberInput
                      className="max-w-xs flex-1"
                      value={fontSize}
                      min={1}
                      step={1}
                      onChange={(event, val) => {
                        setFontSize(val ?? 0);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <span>Letter Spacing</span>
                  <C_NumberInput
                    className="max-w-xs"
                    value={letterSpacing}
                    step={0.05}
                    onChange={(event, val) => {
                      setLetterSpacing(val ?? 0);
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <FontPreview font={fontData} ref={screenRef} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
