import { useEffect } from 'react';

export function useCopyProtection() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for copy/screenshot
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+Shift+I, F12
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);
}
