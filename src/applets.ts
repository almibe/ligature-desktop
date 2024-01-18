import { ModuleValue, WanderResult, WanderValue } from "@wander-lang/wander/src/values"
import { bus } from "./bus"
import { printResult, printValue } from "@wander-lang/wander/src/interpreter"
import { createSignal } from "solid-js";

export const [applets, setApplets] = createSignal<Applet[]>([]);

bus.on("AddApplet", (applet: Applet) => {
    setApplets([applet, ...applets()])
})

bus.on("RemoveApplet", (applet: Applet) => {
      const newResult = applets().filter(r => r == applet);
      setApplets(newResult);
})

export interface Applet {
    readonly name: string
    readonly predicate: (value: WanderResult) => boolean
    readonly render: (value: WanderResult) => Element
}

const errorApplet: Applet = {
    name: "Error",
    predicate: (value: WanderResult) => {
         if (value.isRight()) {
            let wanderValue = value.unsafeCoerce()[0]
            if (wanderValue.type == "Module") {
                return wanderValue.value.has("error")
            }
         }
        return value.isLeft()
    },
    render: (value: WanderResult) => {
        return escape(printResult(value))
    }
}

const textApplet: Applet = {
    name: "Text",
    predicate: (value: WanderResult) => {
        if (value.isRight()) {
            let wanderValue = value.unsafeCoerce()[0];
            if (wanderValue.type == "Module") {
                return wanderValue.value.has("result");
            }
        }
        return false;
    },
    render: (value: WanderResult) => {
        let module: ModuleValue = value.unsafeCoerce()[0];
        let result = printValue(module.value.get("result"));
        return escape(result);
    }
}

const htmlApplet: Applet = {
    name: "Html",
    predicate: (value: WanderResult) => {
        if (value.isRight()) {
            const wanderValue = value.unsafeCoerce()[0];
            if (wanderValue.type == "Module") {
                const result: WanderValue = wanderValue.value.get("result");
                if (result != undefined && result.type == "Module") {
                    return result.value.has("html");
                }
            }
        }
        return false;
    },
    render: (value: WanderResult) => {
        let module: ModuleValue = value.unsafeCoerce()[0];
        let result = module.value.get("result");
        let html = result.value.get("html").value
        return html;
    }
}

export const rawTextApplet: Applet = {
    name: "Raw Text",
    predicate: (value) => true,
    render: (value: WanderResult) => {
        return escape(printResult(value))
    }
}

bus.emit("AddApplet", rawTextApplet)
bus.emit("AddApplet", textApplet)
bus.emit("AddApplet", errorApplet)
bus.emit("AddApplet", htmlApplet)

//from lodash https://github.com/lodash/lodash/blob/9d11b48ce5758df247607dc837a98cbfe449784a/escape.js
const htmlEscapes = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "'": '&#39'
  }
  
  /** Used to match HTML entities and HTML characters. */
  const reUnescapedHtml = /[&<>"']/g
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)
function escape(string: string): string {
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
      : string
  }