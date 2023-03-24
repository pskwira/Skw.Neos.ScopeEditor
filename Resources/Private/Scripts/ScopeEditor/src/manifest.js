import manifest from "@neos-project/neos-ui-extensibility";

import Editor from "./editor.js";

manifest("Skw.Neos.ScopeEditor:ScopeEditor", {}, (globalRegistry) => {
    const editorsRegistry = globalRegistry.get("inspector").get("editors");

    editorsRegistry.set("Skw.Neos.ScopeEditor/ScopeEditor", {
        component: Editor,
    });
});
