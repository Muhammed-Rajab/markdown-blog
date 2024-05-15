# Title Header (H1 header)

### Introduction (H3 header)

This is some placeholder text to show examples of Markdown formatting.
We have [a full article template](https://github.com/do-community/do-article-templates) you can use when writing a DigitalOcean article.
Please refer to our style and formatting guidelines for more detailed explanations: <https://do.co/style>

## Prerequisites (H2 header)

Before you begin this guide you'll need the following:

- Familiarity with [Markdown](https://daringfireball.net/projects/markdown/)

## Step 1 — Basic Markdown

This is _italics_, this is **bold**, this is **underline**, and this is ~~strikethrough~~.

- This is a list item.
- This list is unordered.

1. This is a list item.
2. This list is ordered.

> This is a quote.
>
> > This is a quote inside a quote.
>
> - This is a list in a quote.
> - Another item in the quote list.

Here's how to include an image with alt text and a title:

![Alt text for screen readers](https://assets.digitalocean.com/logos/DO_Logo_horizontal_blue.png "DigitalOcean Logo")

_We also support some extra syntax for setting the width, height and alignment of images. You can provide pixels (`200`/`200px`), or a percentage (`50%`), for the width/height. The alignment can be either `left` or `right`, with images being centered by default. These settings are all optional._

![](https://assets.digitalocean.com/public/mascot.png){ width=200 height=131 align=left }

Use horizontal rules to break up long sections:

---

Rich transformations are also applied:

- On ellipsis: ...
- On quote pairs: "sammy", 'test'
- On dangling single quotes: it's
- On en/em dashes: a -- b, a --- b

<!-- Comments will be removed from the output -->

## Step 2 — Code

This is `inline code`. This is a <^>variable<^>. This is an `in-line code <^>variable<^>`. You can also have [`code` in links](https://www.digitalocean.com).

Here's a configuration file with a label:

Examples can have line numbers, and every code block has a 'Copy' button to copy just the code:

```line_numbers,js
const test = 'hello';
const other = 'world';
console.log(test, other);
```

Here's output from a command with a secondary label:

This is a non-root user command example:

```command
sudo apt-get update
sudo apt-get install python3
```

This is a root command example:

```super_user
adduser sammy
shutdown
```

This is a custom prefix command example:

```custom_prefix(mysql>)
FLUSH PRIVILEGES;
SELECT * FROM articles;
```

A custom prefix can contain a space by using `\s`:

```custom_prefix((my-server)\smysql>)
FLUSH PRIVILEGES;
SELECT * FROM articles;
```

Indicate where commands are being run with environments:

```command
[environment local]
ssh root@server_ip
```

```command
[environment second]
echo "Secondary server"
```

```command
[environment third]
echo "Tertiary server"
```

```command
[environment fourth]
echo "Quaternary server"
```

```command
[environment fifth]
echo "Quinary server"
```

And all of these can be combined together, with a language for syntax highlighting as well as a line prefix (line numbers, command, custom prefix, etc.), and even an environment and label:

```line_numbers,html
[environment second]
[label index.html]
<html>
<body>
<head>
  <title><^>My Title<^></title>
</head>
<body>
  . . .
</body>
</html>
```

## Step 3 — Callouts

Here is a note, a warning, some info and a draft note:

<$>[note]
**Note:** Use this for notes on a publication.
<$>

<$>[warning]
**Warning:** Use this to warn users.
<$>

<$>[info]
**Info:** Use this for product information.
<$>

<$>[draft]
**Draft:** Use this for notes in a draft publication.
<$>

A callout can also be given a label, which supports inline markdown as well:

<$>[note]
[label Labels support _inline_ **markdown**]
**Note:** Use this for notes on a publication.
<$>

You can also mention users by username:

@MattIPv4

## Step 4 — Layout

Columns allow you to customise the layout of your Markdown:

[column
Content inside a column is regular Markdown block content.

> Any block or inline syntax can be used, including quotes.
> ]

[column
Two or more columns adjacent to each other are needed to create a column layout.

On desktop the columns will be evenly distributed in a single row, on tablets they will wrap naturally, and on mobile they will be in a single stack.
]

[details Content can be hidden using `details`.
Inside the details block you can use any block or inline syntax.

You could hide the solution to a problem:

```js
// Write a message to console
console.log("Hello, world!");
```

]

[details open You can also have the details block open by default.
Pass `open` as the first argument to the summary section to do this.

_You can also pass `closed`, though this is the same as not passing anything before the summary._
]

## Step 5 — Embeds

### YouTube

Embedding a YouTube video (id, height, width):

<iframe width="560" height="315" src="https://www.youtube.com/embed/CGIEjak1xfs?si=E1w2KWZjgQCWd-tI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

_Both the width and height are optional, with the defaults being 480 and 270 respectively._\
_The width/height set are treated as maximums -- the video will scale down to fit the available space, maintaining the aspect ratio._

### Wistia

Embedding a Wistia video (id, height, width):

[wistia 7ld71zbvi6 225 400]

_As with the YouTube embed, both the width and height are optional and have the same defaults._\
_The same behaviour applies to the width/height set, with responsive scaling._

### Vimeo

Embedding a Vimeo video (url, height, width):

[vimeo https://player.vimeo.com/video/329272793 225 400]

_As with the YouTube embed, both the width and height are optional and have the same defaults._\
_The same behaviour applies to the width/height set, with responsive scaling._

<iframe height="300" style="width: 100%;" scrolling="no" title="No text duplication slice &amp; offset (SVG filter magic 🪄)" src="https://codepen.io/thebabydino/embed/RwmPZVR?default-tab=html%2Cresult&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/thebabydino/pen/RwmPZVR">
  No text duplication slice &amp; offset (SVG filter magic 🪄)</a> by Ana Tudor (<a href="https://codepen.io/thebabydino">@thebabydino</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### DNS

Embedding DNS record lookups (hostname, record types...):

[dns digitalocean.com A AAAA]

### Glob

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="RwmPZVR" data-user="thebabydino" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/thebabydino/pen/RwmPZVR">
  No text duplication slice &amp; offset (SVG filter magic 🪄)</a> by Ana Tudor (<a href="https://codepen.io/thebabydino">@thebabydino</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Twitter

You can also embed a tweet from Twitter by passing the URL for the tweet:

Like a few other embeds, you can also pass optional flags to customize the embed:

## Step 6 — Tutorials

Certain features of our Markdown engine are designed specifically for our tutorial content-types.
These may not be enabled in all contexts in the DigitalOcean community, but are enabled by default in the do-markdownit plugin.

[rsvp_button 1234 "Marketo RSVP buttons use the `rsvp_button` flag"]

[terminal ubuntu:focal Terminal buttons are behind the `terminal` flag]

## Conclusion

Please refer to our [writing guidelines](https://do.co/style) for more detailed explanations on our style and formatting.
