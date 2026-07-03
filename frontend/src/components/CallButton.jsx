import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
    return (
        <div className="absolute top-5 right-24 z-50">
            <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white shadow-md">
                <VideoIcon className="size-5" />
            </button>
        </div>
    );
}

export default CallButton;