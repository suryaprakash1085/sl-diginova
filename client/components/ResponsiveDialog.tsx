import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onSave?: () => void | Promise<void>;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  isLoading?: boolean;
  isDangerous?: boolean;
  className?: string;
}

export function ResponsiveDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  showSaveButton = true,
  showCancelButton = true,
  isLoading = false,
  isDangerous = false,
  className,
}: ResponsiveDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(value);
    }
    controlledOnOpenChange?.(value);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(
        "w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl",
        "max-h-[90vh] overflow-y-auto",
        className
      )}>
        {title && <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>}
        <div className="py-6 px-2 max-h-[calc(90vh-200px)] overflow-y-auto space-y-4">
          {children}
        </div>
        {footer || (showSaveButton || showCancelButton) ? (
          <DialogFooter className="gap-2 sm:gap-0">
            {showCancelButton && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            )}
            {showSaveButton && (
              <Button
                onClick={handleSave}
                disabled={isLoading}
                variant={isDangerous ? "destructive" : "default"}
              >
                {isLoading ? "..." : saveLabel}
              </Button>
            )}
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
