import { toPng, toJpeg } from 'html-to-image';

export interface ExportOptions {
  format: 'png' | 'jpg';
  quality: number;
  width: number;
  height: number;
  filename?: string;
}

export class ExportUtils {
  static async exportCard(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<Blob> {
    const { format, quality, width, height } = options;

    // Set the dimensions for export
    const originalStyle = element.style.cssText;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    try {
      let dataUrl: string;

      if (format === 'png') {
        dataUrl = await toPng(element, {
          quality: quality / 100,
          canvasWidth: width,
          canvasHeight: height,
          pixelRatio: 2,
        });
      } else {
        dataUrl = await toJpeg(element, {
          quality: quality / 100,
          canvasWidth: width,
          canvasHeight: height,
          pixelRatio: 2,
        });
      }

      // Restore original style
      element.style.cssText = originalStyle;

      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      // Restore original style even on error
      element.style.cssText = originalStyle;
      throw error;
    }
  }

  static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async exportAndDownload(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<void> {
    const blob = await this.exportCard(element, options);
    const filename = options.filename || `promocard-${Date.now()}.${options.format}`;
    this.downloadBlob(blob, filename);
  }

  static async exportToDataURL(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<string> {
    const blob = await this.exportCard(element, options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static getExportFilename(
    templateName: string,
    format: 'png' | 'jpg'
  ): string {
    const sanitizedName = templateName.toLowerCase().replace(/\s+/g, '-');
    return `${sanitizedName}-${Date.now()}.${format}`;
  }

  static async shareCard(dataUrl: string, title: string = 'Check out my card') {
    if (navigator.share && navigator.canShare) {
      try {
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'card.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title,
            files: [file],
          });
          return true;
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(dataUrl);
      alert('Image URL copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
}
