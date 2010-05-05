/* NEW BSD LICENSE {{{
Copyright (c) 2010, anekos.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice,
       this list of conditions and the following disclaimer.
    2. Redistributions in binary form must reproduce the above copyright notice,
       this list of conditions and the following disclaimer in the documentation
       and/or other materials provided with the distribution.
    3. The names of the authors may not be used to endorse or promote products
       derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
THE POSSIBILITY OF SUCH DAMAGE.


###################################################################################
# http://sourceforge.jp/projects/opensource/wiki/licenses%2Fnew_BSD_license       #
# に参考になる日本語訳がありますが、有効なのは上記英文となります。                #
###################################################################################

}}} */

// PLUGIN_INFO {{{
let PLUGIN_INFO =
<VimperatorPlugin>
  <name>openframe-command</name>
  <name lang="ja">openframeコマンド</name>
  <description>Add ":openframe" command.</description>
  <description lang="ja">":openframe" コマンドを追加する</description>
  <version>1.0.0</version>
  <author mail="anekos@snca.net" homepage="http://d.hatena.ne.jp/nokturnalmortum/">anekos</author>
  <license>new BSD License (Please read the source code comments of this plugin)</license>
  <license lang="ja">修正BSDライセンス (ソースコードのコメントを参照してください)</license>
  <updateURL>http://svn.coderepos.org/share/lang/javascript/vimperator-plugins/trunk/open-frame.js</updateURL>
  <minVersion>2.3</minVersion>
  <maxVersion>2.3</maxVersion>
  <detail><![CDATA[
    Add "openframe" and "tabopenframe" command.
  ]]></detail>
  <detail lang="ja"><![CDATA[
    コマンド "openframe" と "tabopenframe" を追加します。
  ]]></detail>
</VimperatorPlugin>;
// }}}
// INFO {{{
let INFO =
<>
  <plugin name="openframe-command" version="1.0.0"
          href="http://svn.coderepos.org/share/lang/javascript/vimperator-plugins/trunk/open-frame.js"
          summary="Add openframe command."
          lang="en-US"
          xmlns="http://vimperator.org/namespaces/liberator">
    <author email="anekos@snca.net">anekos</author>
    <license>New BSD License</license>
    <project name="Vimperator" minVersion="2.3"/>
    <item>
      <tags>:openframe</tags>
      <spec>:openf<oa>rame</oa></spec>
      <description><p>Open the selected frame in current tab.</p></description>
    </item>
    <item>
      <tags>:tabopenframe</tags>
      <spec>:tabopenf<oa>rame</oa></spec>
      <description><p>Open the selected frame in new tab.</p></description>
    </item>
  </plugin>
  <plugin name="openframe-command" version="1.0.0"
          href="http://svn.coderepos.org/share/lang/javascript/vimperator-plugins/trunk/open-frame.js"
          summary="Add openframe command."
          lang="ja"
          xmlns="http://vimperator.org/namespaces/liberator">
    <author email="anekos@snca.net">anekos</author>
    <license>New BSD License</license>
    <project name="Vimperator" minVersion="2.3"/>
    <item>
      <tags>:openframe</tags>
      <spec>:openf<oa>rame</oa></spec>
      <description><p>現在のタブに選択したフレームを開く</p></description>
    </item>
    <item>
      <tags>:tabopenframe</tags>
      <spec>:tabopenf<oa>rame</oa></spec>
      <description><p>新しいタブに選択したフレームを開く</p></description>
    </item>
  </plugin>
</>;
// }}}

(function () {

  [true, false].forEach(function (tab) {
    let desc = 'Open frame in ' + (tab ? 'current tab' : 'new tab');
    let modeName = (tab ? 'tab-' : '') + 'open-frame';
    hints.addMode(
      modeName,
      desc,
      function (elem) {
        liberator.open(
          elem.ownerDocument.location.href,
          tab ? liberator.NEW_TAB : liberator.CURRENT_TAB
        );
      },
      function () util.makeXPath(["body"])
    );

    commands.addUserCommand(
      [(tab ? 'tab' : '') + 'openf[rame]'],
      desc,
      function (args) {
        hints.show(modeName);
      },
      {},
      true
    );
  });

})();

// vim:sw=2 ts=2 et si fdm=marker:
