import sanitizeHtml from "sanitize-html";

export const sanitize = (dirty: string) => {
    return sanitizeHtml(dirty, {
        allowedTags: [
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
            "p",
            "a",
            "ul",
            "ol",
            "nl",
            "li",
            "b",
            "i",
            "strong",
            "em",
            "strike",
            "code",
            "hr",
            "br",
            "div",
            "table",
            "thead",
            "caption",
            "tbody",
            "tr",
            "th",
            "td",
            "pre",
            "span"
        ],
        allowedAttributes: {
            a: ["href", "name", "target", "data-*"],
            // We don't currently allow img itself by default, but this
            // would make sense if we did
            img: ["src", "title"],
            span: ["class"],
            pre: ["class"],
            code: ["class"],
            p: ["class"],
            div: ["class"],
            table: ["class"],
            tbody: ["class"],
            ul: ["class"],
            ol: ["class"],
            li: ["class"]
        },
        // Lots of these won't come up by default because we don't allow them
        selfClosing: [
            "img",
            "br",
            "hr",
            "area",
            "base",
            "basefont",
            "input",
            "link",
            "meta"
        ],
        // URL schemes we permit
        allowedSchemes: ["http", "https", "ftp", "mailto"],
        allowedSchemesByTag: {},
        allowProtocolRelative: true
    });
};
