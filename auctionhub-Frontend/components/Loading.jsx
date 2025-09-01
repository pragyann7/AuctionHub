export const Loader = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-screen">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <div className="text-2xl animate-pulse mt-4">{text}</div>
    </div>
);
