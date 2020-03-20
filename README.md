# Deep Physics Based Rendering

This is the public facing site for RealityVirtual project.

Click here for the website:
http://deeppbr.io


Contained here are the gulp and such instructions for setting up this actual site.  


## Setup

```bash
npm install -g gulp  # May require `sudo`
```

## Developing

```bash
npm install            # One time
# yarn install - doesn't work dunno why, don't care
gulp serve
```

## Gulp Commands

An overview of Gulp commands available:

### `gulp build`

Builds the site into the `dist` directory.  This includes:

- SCSS, sourcemaps and autoprefixing
- JS uglification
- Handlebars to HTML

### `gulp build:optimized`

This is used for distributing an optimized version of the site (for deployment).  It includes everything from `gulp build` as well as:
- SCSS minification
- CSS / JS inline-sourcing 

### `gulp watch`

Watchs for changes in local files and rebuilds parts of the site as necessary, into the `dist` directory.

### `gulp serve`

Runs `gulp watch` in the background, and serves the `dist` directory at `localhost:3000` with automatic reloading using [Browsersync][browsersync].

## Structure

```bash
├── webpack.config.dev.js   # Controls javascript and css bundling
├── Gulpfile.js             # Controls Gulp, used for building the website
├── README.md               # This file
├── data.yml                # Metadata associated with the site.
├── dist/                   # Gulp builds the static site into this directory
├── package.json            # Dependencies
└── src/                    # All source code
    ├── assets/ 
        ├── css/            # Stylesheets
        ├── font/           # Font files
        ├── img/            # Images and SVGs
        ├── js/             # Javascript libraries and scripts
    ├── views/     
        ├── partials/       # Handlebars HTML partials that are included / extended
        └── templates/      # Handlebars HTML files, one per page on the site.
```

[browsersync]: http://www.browsersync.io/
[gulp]: http://gulpjs.com/
[handlebars]: http://handlebarsjs.com/
[htmlmin]: https://github.com/kangax/html-minifier
[imagemin]: https://github.com/imagemin/imagemin
[npm-install]: https://nodejs.org/en/download/
[scss]: http://sass-lang.com/
[webpack]: https://webpack.js.org/


# Deploying to GitHub Pages

Running in dev is different from deploying to build.

To deploy to the site we build first to the 'dist' directory.

We end up with a subdirectory on the `master` branch that needs to be the root directory of a `gh-pages` branch at github. 

So, to deploy:

### Step 1

First build to dist directory:

```
gulp build
```

### Step 2

Use subtree push to send it to the `gh-pages` branch on GitHub.

```sh
git subtree push --prefix dist origin gh-pages
```

---

If we do this on a regular basis, you could also [create a script](https://github.com/cobyism/dotfiles/blob/master/bin/git-gh-deploy) containing the following somewhere in your path:

```sh
#!/bin/sh
if [ -z "$1" ]
then
  echo "Which folder do you want to deploy to GitHub Pages?"
  exit 1
fi
git subtree push --prefix $1 origin gh-pages
```

Which lets you type commands like:

```sh
git gh-deploy path/to/your/site
```

## Copyright and License

All content and code here is Copyright 2018 RealityVirtual Ltd, NZ. 

Some of the theme code here is based on Blackrock digital "Start Bootstrap GrayScale" theme which was released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-grayscale/blob/gh-pages/LICENSE) license and they retain the copyright for their theme content (css and styling information) only.

Also, this site was partially based on [frontend-starter]: https://github.com/rakshans1/frontend-starter
