
/*
 * さわるなきけん！
 * DO NOT USE!
 * */



(function(){
  const U = liberator.plugins.libly.$U;

  let pluginDirPath = liberator.globalVariables.pmwriter_plugin_dir;
  let outputDir = liberator.globalVariables.pmwriter_output_dir;


  if (!(pluginDirPath && outputDir))
    return;

  if (!liberator.plugins.pmwriter)
    liberator.plugins.pmwriter = {};

  // make を改造
  {
    let makeLink = liberator.eval('makeLink', liberator.plugins.pluginManager.list);
    if (!liberator.plugins.pmwriter.makeLink) {
      liberator.plugins.pmwriter.makeLink = function (str) makeLink(str, true);
      liberator.eval('makeLink = liberator.plugins.pmwriter.makeLink ', liberator.plugins.pluginManager.list);
    }
    //let WikiParser = liberator.eval('WikiParser', liberator.plugins.pluginManager.list);
    //WikiParser.prototype.inlineParse = function (str) {
    //  function replacer(_, s)
    //    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[s] ||
    //    '<a href="' + s + '" highlight="URL">' + s + '</a>';
    //  try {
    //    return XMLList(str.replace(/(>|<|&|(?:https?:\/\/|mailto:)\S+)/g, replacer));
    //  } catch (e) {
    //    return XMLList(str);
    //  }
    //};
  }

  function action () {

    const IOService = services.get('io');
    const DOCUMENT_TITLE = 'Vimperator Plugins in CodeRepos';
    const CodeRepos = 'http://coderepos.org/share/browser/lang/javascript/vimperator-plugins/trunk/';
    const CodeReposFile = 'http://svn.coderepos.org/share/lang/javascript/vimperator-plugins/trunk/';

    function Context (file) {
      this.NAME = file.leafName.replace(/\..*/, '')
                      .replace(/-([a-z])/g, function (m, n1) n1.toUpperCase());
    };

    let myname = __context__.NAME;

    let otags = liberator.eval('tags', liberator.plugins.pluginManager.list);
    let template = liberator.eval('template', liberator.plugins.pluginManager.list);

    let linkTo;
    let tags = {
      __proto__: otags,
      name: function () <a href={linkTo}>{otags.name.apply(otags, arguments)}</a>
    };

    let files = io.readDirectory(pluginDirPath);
    let indexHtml = <></>;
    let allHtml = <></>;

    files.forEach(function (file) {
      if (!/\.js$/.test(file.path))
        return;

      if (!/PLUGIN_INFO/.test(io.readFile(file.path)))
        return;

      try {
        let context = new Context(file);
        let pluginName = file.leafName.replace(/\..*$/, '');
        let pluginFilename = file.leafName;

        if (context.NAME == myname)
          return;

        let pluginInfo;
        let htmlFilename = pluginName + '.html';

        context.watch('PLUGIN_INFO', function (n, O, N) { pluginInfo = N; throw 'STOP';});

        try {
          services.get("subscriptLoader").loadSubScript(IOService.newFileURI(file).spec, context);
        } catch (e) {
          /* DO NOTHING */
        }

        tags.name = function () <a href={linkTo}>{otags.name.apply(otags, arguments)}</a>;

        let plugin = [];
        let (info = pluginInfo) {
          plugin['name'] = pluginName;
          plugin['info'] = {};
          plugin['orgInfo'] = {};

          for (let tag in tags){
            plugin.orgInfo[tag] = info[tag];
            let value = tags[tag](info);
            if (value && value.toString().length > 0){
              plugin.push([tag, value]);
              plugin.info[tag] = value;
            }
          }
        }

        let authors;
        {
          for each (let a in pluginInfo.author) {
            let hp = a.@homepage.toString();
            let xml = hp ? <a href={hp}>{a.toString()}</a>
                         : <span>{a.toString()}</span>
            if (authors)
              authors += <span>, </span> + xml;
            else
              authors = xml;
          }
        }

        // プラグイン毎のドキュメント
        {
          let src = pluginInfo.detail.toString();
          //let detailBody = liberator.plugins.PMWikiParser(src.split(/\n/));
          let detailBody = plugin.info.detail
          let body = <div>
                <div class="information" id="information">
                  <h1>{plugin.info.name.toString()}</h1>
                  <div>
                    <dl>
                      <dt>Description</dt>
                      <dd>{plugin.info.description || '---'}</dd>
                      <dt>Latest version</dt>
                      <dd>{plugin.info.version || '???'}</dd>
                      <dt>Vimperator version</dt>
                      <dd>{(plugin.info.minVersion || '?') + ' - ' + (plugin.info.maxVersion || '?')}</dd>
                      <dt>URL</dt>
                      <dd><a href={CodeRepos + pluginFilename} class="coderepos" target="_blank">{CodeRepos + pluginFilename}</a></dd>
                      <dt>File URL</dt>
                      <dd><a id="file-link" href={CodeReposFile + pluginFilename} class="coderepos" target="_blank">{CodeReposFile + pluginFilename}</a></dd>
                      <dt>Author</dt>
                      <dd>{authors}</dd>
                      <dt>License</dt>
                      <dd>{plugin.info.license || '--'}</dd>
                    </dl>
                  </div>
                </div>
                <div class="detail" id="detail">{detailBody}</div>
                </div>;

          io.writeFile(
            io.getFile(outputDir + htmlFilename),
            <html>
              <head>
                <title>{plugin.info.name.toString()}</title>
                <link rel="stylesheet" href="plugin.css" type="text/css" />
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              </head>
              <body>
                {body}
              </body>
            </html>.toString()
          );
          allHtml += body;
        }

        // index.html
        {
          indexHtml += <tr class="plugin">
            <td class="name">
              <a href={CodeRepos + pluginFilename} class="coderepos" target="_blank">{"\u2606"}</a>
              <a href={htmlFilename} class="link">{plugin.name}</a>
            </td>
            <td class="description">
              {plugin.info.description}
            </td>
            <td class="author">
              {authors}
            </td>
          </tr>
        }
      } catch (e) {
        liberator.log({filename: file.path})
        liberator.log(e.stack)
        liberator.log(e)
      }
    });

    indexHtml = <html>
      <head>
        <title>{DOCUMENT_TITLE}</title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <link rel="stylesheet" href="voqn.css" type="text/css" />
        <script type="text/javascript" src="http://s.hatena.ne.jp/js/HatenaStar.js" />
        <script type="text/javascript">
          Hatena.Star.Token = '48e8f4c633307a76a4dd923111e22a25e80b6e8a';
        </script>
        <style><![CDATA[
          .hatena-star-comment-container {
            display: none;
            padding: 0;
            margin: 0;
          }
        ]]></style>
        <script type="text/javascript"><![CDATA[
          Hatena.Star.SiteConfig = {
            entryNodes: {
              'tr': {
                uri: 'a.coderepos',
                title: 'td.name',
                container: 'td.name'
              }
            }
          };
        ]]></script>
      </head>
      <body>
        <h1>{DOCUMENT_TITLE}</h1>
        <table>
          <tr class="header">
            <th class="name">Name</th>
            <th class="description">Description</th>
            <th class="author">Author</th>
          </tr>
          {indexHtml}
        </table>
        <div class="last-updated">Last updated {new Date().toLocaleFormat('%Y/%m/%d %H:%M:%S')}</div>
      </body>
    </html>;

    allHtml = <html>
            <head>
              <title>All Plugins</title>
              <link rel="stylesheet" href="plugin.css" type="text/css" />
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            </head>
            <body>
              {allHtml}
            </body>
          </html>.toString();

    io.writeFile(io.getFile(outputDir + 'index.html'), indexHtml.toString());
    io.writeFile(io.getFile(outputDir + 'all.html'), allHtml.toString());
  }

  commands.addUserCommand(
    ['pmwrite'],
    'PMWriter',
    action,
    {},
    true
  );

})();
// vim: sw=2 ts=2 et fdm=marker:

