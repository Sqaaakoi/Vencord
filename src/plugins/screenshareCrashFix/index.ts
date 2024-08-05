import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "ScreenshareCrashFix",
    description: "Fixes the unknown resolution/frame rate crash when watching someone's stream",
    authors: [Devs.Sqaaakoi],
    patches: [
        {
            find: 'Error("Unknown resolution: ".concat',
            replacement: {
                match: /switch\((\i)\).{0,150}?Error/g,
                replace: "return $1;$&"
            }
        }
    ]

});
