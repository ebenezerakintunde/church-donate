"use client";

import { useState } from "react";
import { generateColorPalette, hasGoodContrast } from "@/lib/colorUtils";

interface ThemeColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ThemeColorPicker({
  value = "#1e3a8a",
  onChange,
  label = "Theme Color (Optional)",
}: ThemeColorPickerProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [tempColor, setTempColor] = useState(value);

  const handleColorChange = (color: string) => {
    setTempColor(color);
    onChange(color);
  };

  const palette = generateColorPalette(tempColor || "#1e3a8a");
  const hasContrast = hasGoodContrast(tempColor || "#1e3a8a");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-center gap-4">
        {/* Color Input */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={tempColor || "#1e3a8a"}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={tempColor || "#1e3a8a"}
            onChange={(e) => {
              const hex = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                handleColorChange(hex);
              }
            }}
            placeholder="#1e3a8a"
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md font-mono text-sm w-32"
          />
        </div>

        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
          Preview Theme
        </button>
      </div>

      {/* Color Info */}
      <div className="text-sm text-gray-600">
        <p>
          The donation page will use shades of this color for backgrounds,
          buttons, and accents.
        </p>
        {!hasContrast && tempColor && (
          <p className="text-amber-600 mt-1">
            ⚠️ This color might be too light. Consider using a darker shade for
            better readability.
          </p>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Theme Preview</h3>
                <p className="text-sm text-gray-600">
                  This is how your church donation page will look
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Preview Content */}
            <div
              className="min-h-[500px]"
              style={{
                background: `linear-gradient(to bottom right, ${palette[800]}, ${palette[900]}, ${palette[900]})`,
              }}>
              <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                  {/* Sample Church Card */}
                  <div className="bg-white shadow-2xl overflow-hidden rounded-lg">
                    {/* Header */}
                    <div
                      className="text-white p-8 text-center"
                      style={{
                        background: `linear-gradient(to right, ${palette[800]}, ${palette[900]})`,
                      }}>
                      <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <h1 className="text-3xl font-bold mb-2">Sample Church</h1>
                      <p className="text-lg" style={{ color: palette[200] }}>
                        Dublin, Ireland
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <p className="text-gray-600 mb-6">
                        This is a sample description of your church. Your actual
                        church information will appear here.
                      </p>

                      {/* Sample Bank Details */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Bank Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Bank Name:</span>
                            <span className="font-mono text-sm">
                              Sample Bank
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Account Name:</span>
                            <span className="font-mono text-sm">
                              Sample Church
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sample Buttons */}
                      <div className="flex gap-3">
                        <button
                          className="px-6 py-3 text-white rounded-lg font-semibold transition-colors"
                          style={{
                            backgroundColor: palette[600],
                          }}>
                          Copy Details
                        </button>
                        <button
                          className="px-6 py-3 text-white rounded-lg font-semibold transition-colors"
                          style={{
                            backgroundColor: palette[700],
                          }}>
                          Share Page
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette Reference */}
                  <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: palette[200] }}>
                      Color Palette Generated:
                    </p>
                    <div className="flex gap-1">
                      {Object.entries(palette).map(([shade, color]) => (
                        <div key={shade} className="flex-1 text-center">
                          <div
                            className="h-12 rounded"
                            style={{ backgroundColor: color }}
                          />
                          <span
                            className="text-xs mt-1 block"
                            style={{ color: palette[300] }}>
                            {shade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Close Preview
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                Use This Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
