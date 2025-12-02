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
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="flex items-center justify-center">
        {/* move the entire device frame to the center */}
        <div className="scale-110 translate-x-6/5">
          
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
    </div>
  );
};

export default PhoneFrame;
