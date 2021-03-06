'use strict';
const expect = require('chai').expect;
const WebpackTool = require('webpack-tool');
const webpack = WebpackTool.webpack;
const utils = require('../utils/utils');
const WebpackClientBuilder = require('../lib/client')
const WebpackServerBuilder = require('../lib/server');
const path = require('path').posix;
const baseDir = path.join(__dirname, '..');

class VueClientBuilder extends WebpackClientBuilder {
  constructor(config) {
    super(config);
    this.mergeConfig({
      buildPath: 'dist/vue',
      publicPath: 'public/dist',
      plugins: {
        manifest: false
      }
    });
  }
}

function getPluginByLabel(label, plugins) {
  return plugins.find(plugin => {
    return plugin.__lable__ === label;
  });
}

describe('vue.test.js', () => {
  before(() => {
  });

  after(() => {
  });

  beforeEach(() => {
  });

  afterEach(() => {
  });

  describe('#webpack createWebpackPlugin test', () => {
    it('should vue solution client render solution config', () => {
      const builder = new VueClientBuilder({
        baseDir,
        entry: {
          include: __dirname,
          template: 'test/layout.html'
        }
      });
      const webpackConfig = builder.create();
      const plugins = webpackConfig.plugins;
      expect(webpackConfig.output.path).to.equal(path.join(baseDir, 'dist/vue'));
      expect(webpackConfig.output.publicPath).to.equal(`${utils.getHost('9000')}/public/dist/`);

      expect(!!getPluginByLabel('manifest', plugins)).to.be.false;
      expect(!!getPluginByLabel('commonsChunk', plugins)).to.be.true;
      expect(!!getPluginByLabel('runtime', plugins)).to.be.true;
    });

    it('should vue solution client render solution config override by custom config', () => {
      const builder = new VueClientBuilder({
        cost: true,
        baseDir,
        buildPath: 'dist/vue/override',
        publicPath: 'public/dist/override',
        entry: {
          include: __dirname,
          template: 'test/layout.html'
        }
      });
      const webpackConfig = builder.create();
      const plugins = webpackConfig.plugins;
      expect(webpackConfig.entry['base.test'].length).to.equal(2);
      expect(webpackConfig.entry['base.test'][0]).to.includes('webpack-hot-middleware');
      expect(webpackConfig.output.path).to.equal(path.join(baseDir, 'dist/vue/override'));
      expect(webpackConfig.output.publicPath).to.equal(`${utils.getHost('9000')}/public/dist/override/`);

      expect(!!getPluginByLabel('manifest', plugins)).to.be.false;
      expect(!!getPluginByLabel('commonsChunk', plugins)).to.be.true;
      expect(!!getPluginByLabel('runtime', plugins)).to.be.true;
    });

    it('should egg test', () => {
      const builder = new WebpackServerBuilder({ egg: true, baseDir: path.join(__dirname, '..') });
      const webpackConfig = builder.create();
      expect(webpackConfig.output.path).to.equal(path.join(__dirname, '../app/view'));
    });
  });
});
