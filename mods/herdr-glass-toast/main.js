// glass: a clone of Herdr's `toast` mod 0.1.16 (Apache-2.0, see NOTICE), changed for Herdr Glass:
// a colour bar by level, and an agent's live title in the body.
// Notifications for the glass layout. Herdr's body for an agent is "<space> / <tab name>",
// and an unnamed tab is called "1", so name the agent by its live title instead,
// as the tab bar does. Click runs the action (go to the agent) and dismisses.

import { View, div, image } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { props, closeOverlay, run, theme, panes, spaces } from "herdr";

const COLOR = { error: "blocked", warning: "working", success: "done", info: "accent" };

// Same cleanup as the tabs mod: drops a leading status glyph from a terminal title.
const clean = (s) => (s ?? "").replace(/^[^\p{L}\p{N}\p{Ps}\p{Pi}]+/u, "").replace(/^\[ [!.] \] /, "").trim();

function agentBody(p) {
  const terminal = p.action?.name === "agent.focus" ? p.action.args?.terminal : null;
  if (!terminal) return null;
  const pane = panes().find(x => x.terminal === terminal);
  if (!pane) return null;
  const space = spaces().find(s => s.tabs?.some(t => t.id === pane.tab));
  const tab = space?.tabs.find(t => t.id === pane.tab);
  const title = clean(pane.title);
  const useful = title && title !== terminal && title !== pane.program?.name && !/^[~/]/.test(title);
  const what = useful ? title : tab?.named ? tab.name : null;
  return [space?.name, what].filter(Boolean).join(" · ") || null;
}

export default class Toast extends View {
  render() {
    const t = theme();
    const p = props() ?? {};
    const login = /^([a-z0-9][a-z0-9_.-]{0,31}) needs login; run hc machine login \1$/.exec(p.body ?? "");
    const command = login ? `hc machine login ${login[1]}` : null;
    const color = t[COLOR[p.level] ?? "accent"];
    const body = login ? null : agentBody(p) ?? p.body ?? "";
    return h_flex()
      .id("toast")
      .size_full()
      .pl(14)
      .pr(18)
      .gap(12)
      .items_center()
      .bg(t.popover)
      .cursor_pointer()
      .hover((s) => s.bg(t.hover))
      .on_click(() => {
        if (p.action?.name) run(p.action.name, p.action.args ?? {});
        closeOverlay(p.overlay);
      })
      .child(div().w(3).h(30).rounded(2).flex_none().bg(color))
      .when(Boolean(p.icon), (el) => el.child(image(p.icon).w(18).h(18).flex_none()))
      .child(
        v_flex()
          .flex_1()
          .min_w(0)
          .gap(2)
          .child(div().truncate().font_semibold().text_size(13).text_color(t.foreground).child(login ? `${login[1]} needs a login: run` : p.title ?? ""))
          .when(Boolean(body), (el) => el.child(div().truncate().text_size(12).text_color(t.muted).child(body)))
          .when(Boolean(login), (el) => el.child(h_flex().gap(8).items_center()
            .child(div().flex_1().min_w(0).truncate().tooltip(command).text_size(12).text_color(t.muted).child(command))
            .child(div().id("toast-login-copy").flex_none().px(6).py(3).rounded(4).bg(t.raised)
              .text_size(12).text_color(t.foreground).cursor_pointer().hover(s => s.bg(t.hover))
              .on_click((_e, cx) => { cx.stop_propagation(); cx.write_to_clipboard(command); this.copied = true; cx.notify(); })
              .child(this.copied ? "Copied" : "Copy")))),
      );
  }
}
