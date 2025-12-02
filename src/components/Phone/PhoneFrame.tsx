import { ReactNode } from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * PhoneFrame - Wraps content in an iPhone X frame for mobile prototype display
 * Dimensions: 450x975px (1.2x scale for better visibility)
 * Centered on desktop screens with dark gradient background
 */
const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-x-hidden">
      {/* Responsive scaling: smaller on mobile, larger on desktop */}
      <div className="scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100 xl:scale-110 origin-center mx-auto">
        <DeviceFrameset
          device="iPhone X"
          color="black"
          width={450}
          height={800}
        >
          <div className="w-full h-full overflow-hidden bg-white">
            {children}
          </div>
        </DeviceFrameset>
      </div>
    </div>
  );
};

export default PhoneFrame;
