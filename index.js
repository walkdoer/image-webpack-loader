var imagemin = require('imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');
var imageminPngquant = require('imagemin-pngquant');
var loaderUtils = require('loader-utils');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');


module.exports = function(content) {
  this.cacheable && this.cacheable();

  var config = loaderUtils.getLoaderConfig(this, "imageWebpackLoader");
  var options = {
    interlaced: config.interlaced || false,
    progressive: config.progressive || false,
    optimizationLevel: config.optimizationLevel || 3,
    bypassOnDebug: config.bypassOnDebug || false,
    pngquant: config.pngquant || false,
    jpeg: config.jpeg || { quality: 'medium', min: 40, max: 80, progressive: true},
    svgo: config.svgo || {}
  };

  var callback = this.async(), called = false;

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  } else {
    var plugins = [];
    plugins.push(imageminGifsicle({interlaced: options.interlaced}));
    plugins.push(imageminJpegRecompress(options.jpeg));
    plugins.push(imageminSvgo(options.svgo));
    plugins.push(imageminPngquant(options.pngquant));
    plugins.push(imageminOptipng({optimizationLevel: options.optimizationLevel}));

    imagemin
      .buffer(content, {plugins})
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        callback(err);
      });
  }
};
module.exports.raw = true;
