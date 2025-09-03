import { useState } from 'react';
import { CircleAlert } from 'lucide-react';

function ImageUploadLabel() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex items-center">

            <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
            </label>


            <div className="relative ml-auto md:ml-1">
                <div
                    className="inline-block group"
                    onClick={() => setShowTooltip(!showTooltip)}
                >
                    <CircleAlert
                        className="cursor-pointer"
                        size={19}
                        strokeWidth={1.25}
                    />

                    <div
                        className={`absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-60 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-50 pointer-events-none
          opacity-0 group-hover:opacity-100
          ${showTooltip ? 'opacity-100' : ''}
          transition-opacity duration-200`}
                    >
                        <p className="font-semibold mb-1">Image Guidelines:</p>
                        <ul className="list-disc list-inside">
                            <li>Format: JPG or PNG</li>
                            <li>Max size: 5 MB</li>
                            <li>Recommended: 800x800 px</li>
                            <li>Single product per image</li>
                            <li>Neutral background preferred</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ImageUploadLabel;
