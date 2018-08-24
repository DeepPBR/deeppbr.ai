# Deep Physics Based Rendering

This is the public facing site for RealityVirtual project.

Contained here are the gulp and such instructions for setting up this actual site.  

## Usage

### Basic Usage

After downloading, simply edit the HTML and CSS files included with the template in your favorite text editor to make changes. These are the only files you need to worry about, you can ignore everything else! To preview the changes you make to the code, you can open the `index.html` file in your web browser.

### Advanced Usage

After installation, run `npm install` and then run `gulp dev` which will open up a preview of the template in your default browser, watch for changes to core template files, and live reload the browser when changes are saved. You can view the `gulpfile.js` to see which tasks are included with the dev environment.

#### Gulp Tasks

- `gulp` the default task that builds everything
- `gulp dev` browserSync opens the project in your default browser and live reloads when changes are made
- `gulp css` compiles SCSS files into CSS and minifies the compiled CSS
- `gulp js` minifies the themes JS file
- `gulp vendor` copies dependencies from node_modules to the vendor directory

You must have npm and Gulp installed globally on your machine in order to use these features.

## Copyright and License

All content and code here is Copyright 2018 RealityVirtual Ltd, NZ. 

Some of the theme code here is based on Blackrock digital "Start Bootstrap GrayScale" theme which was released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-grayscale/blob/gh-pages/LICENSE) license and they retain the copyright for their theme content (css and styling information) only