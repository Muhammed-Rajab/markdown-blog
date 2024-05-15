# Exploring Creative Coding with p5.js

p5.js is a JavaScript library aimed at making coding accessible for artists, designers, educators, and beginners. It provides a simple and intuitive environment for creating interactive graphics and animations directly in the browser.

## Getting Started with p5.js

To start coding with p5.js, all you need is a text editor and a web browser. You can quickly set up a new project by including the p5.js library in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>p5.js Sketch</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <script src="sketch.js"></script>
  </head>
  <body></body>
</html>
```

Next, create a new JavaScript file (e.g., `sketch.js`) where you will write your p5.js code. You can start with a simple sketch:

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(mouseX, mouseY, 50, 50);
}
```

This code creates a canvas and draws an ellipse that follows the mouse cursor.

## Creating Interactive Art

One of the exciting aspects of p5.js is its ability to create interactive art. You can respond to user input, such as mouse movements or keyboard presses, to create dynamic and engaging experiences.

Here's an example of a sketch that changes colors when you click the mouse:

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseIsPressed) {
    fill(random(255), random(255), random(255));
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 50, 50);
}
```

## Adding Images

Images can enhance your p5.js sketches and add visual interest. You can load images using the `loadImage()` function and then display them using the `image()` function.

```javascript
let img;

function preload() {
  img = loadImage("flower.png");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  image(img, mouseX, mouseY);
}
```

You can include the image file (`flower.png`) in the same directory as your HTML file.

## Embedding Videos

In addition to images, you can also embed videos into your p5.js sketches using HTML's `<iframe>` tag. Here's how you can embed a YouTube video:

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  frameborder="0"
  allowfullscreen
></iframe>
```

Replace the `src` attribute value with the URL of the YouTube video you want to embed.

## Conclusion

p5.js provides a fun and accessible way to dive into creative coding. Whether you're an artist, designer, educator, or beginner coder, p5.js offers a platform for experimentation and expression. Start coding with p5.js today!

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

_As with the YouTube embed, both the width and height are optional and have the same defaults._\
_The same behaviour applies to the width/height set, with responsive scaling._

<iframe height="300" style="width: 100%;" scrolling="no" title="No text duplication slice &amp; offset (SVG filter magic 🪄)" src="https://codepen.io/thebabydino/embed/RwmPZVR?default-tab=html%2Cresult&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/thebabydino/pen/RwmPZVR">
  No text duplication slice &amp; offset (SVG filter magic 🪄)</a> by Ana Tudor (<a href="https://codepen.io/thebabydino">@thebabydino</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
