"use client";

import {
    UploadCloud,
    Image as ImageIcon,
    Loader2,
    X,
    Star,
    ImagePlus,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MediaGalleryCardProps {
    isUploading: boolean;
    currentImageUrls: string[];
    currentHeaderImage: string;
    onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (url: string) => void;
    onSetMainImage: (url: string) => void;
}

export function MediaGalleryCard({
    isUploading,
    currentImageUrls,
    currentHeaderImage,
    onImageSelect,
    onRemoveImage,
    onSetMainImage,
}: MediaGalleryCardProps) {
    return (
        <Card className="rounded-xl bg-white border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                        <ImageIcon size={16} className="text-violet-600" />
                    </div>
                    <h2 className="font-semibold text-[15px]">Media Gallery</h2>
                    {currentImageUrls.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                            {currentImageUrls.length} {currentImageUrls.length === 1 ? "photo" : "photos"}
                        </Badge>
                    )}
                </div>

                {/* Upload Drop Zone */}
                <label
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 mb-6 group overflow-hidden",
                        isUploading
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/50 bg-[#ebe9ff]/60 hover:bg-[#ebe9ff] hover:border-primary/30"
                    )}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                            <span className="text-sm font-medium text-primary">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                                <UploadCloud className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">
                                Click to upload high-res photos
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                PNG, JPG or WebP up to 10MB each
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onImageSelect}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>

                {/* Gallery Grid */}
                <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Uploaded Photos
                    </p>

                    {currentImageUrls.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-10 text-center bg-muted/20">
                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                <ImagePlus size={20} className="text-muted-foreground/60" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No images uploaded yet</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                Upload vehicle photos to showcase your listing
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {currentImageUrls.map((url, index) => (
                                <div
                                    key={url}
                                    className={cn(
                                        "relative aspect-square rounded-lg overflow-hidden group shadow-sm transition-all duration-200",
                                        currentHeaderImage === url
                                            ? "ring-2 ring-primary ring-offset-2"
                                            : "hover:ring-1 hover:ring-border hover:ring-offset-1"
                                    )}
                                >
                                    <Image
                                        src={url}
                                        alt={`Vehicle photo ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="120px"
                                    />

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                                        {currentHeaderImage !== url && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onSetMainImage(url);
                                                }}
                                                className="text-[10px] bg-white/90 backdrop-blur-sm text-black px-2.5 py-1 rounded-md font-semibold hover:bg-white transition-colors flex items-center gap-1"
                                            >
                                                <Star size={10} />
                                                Set Main
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onRemoveImage(url);
                                            }}
                                            className="p-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>

                                    {/* Main badge */}
                                    {currentHeaderImage === url && (
                                        <div className="absolute bottom-1.5 left-1.5 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-lg">
                                            Main
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
