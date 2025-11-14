import { saveCanvasPngDataUrl } from '../../media/image';

export async function handleSaveCanvasImage(
  params: { dataUrl: string; fileName?: string },
  deps?: { getDefaultFolder?: () => string | undefined }
) {
  await saveCanvasPngDataUrl(params.dataUrl, { defaultFileName: params.fileName, getDefaultFolder: deps?.getDefaultFolder });
}
