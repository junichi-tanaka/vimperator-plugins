/*
 * liberator plugin
 * Add `pukka' http://codesorcery.net/pukka/ command to Bookmark del.icio.us
 * For liberator 0.6pre
 * @author otsune (based on teramako)
 * @version 0.1
 * 
 * Variable:
 *  g:pukka_normalizelink
 *      Specifies keys that use Pathtraq URL Normalizer 
 *      usage: let g:pukka_normalizelink = "true"
 * Mappings:
 *  '[C-z]':
 * Commands:
 *  'pukka' or 'pu':
 *      Post bookmark to del.icio.us with Pukka
 *      usage: :pukka http://example.com/ 
 * Options:
 *  not implemented
 */

(function(){
    var useNormalizelink = window.eval(liberator.globalVariables.pukka_normalizelink) || false;
liberator.commands.addUserCommand(['pukka','pu'], 'Post to Pukka bookmark',
function(args){
    if (!liberator.buffer.title || !liberator.buffer.URL || liberator.buffer.URL=='about:blank'){
        return false;
    }
    var str = 'pukka:';
    var title = encodeURIComponent(liberator.buffer.title);
    var url = encodeURIComponent(liberator.buffer.URL);
    var extend = liberator.buffer.getCurrentWord();
    if (args){
        url = encodeURIComponent(args);
    }
    liberator.open(str + 'url=' + url + '&title=' + title + '&extended=' + extend);
},{
    completer: function(filter){
        var complist = [];
        if(useNormalizelink){
            complist.push([getNormalizedPermalink(liberator.buffer.URL), 'Normalized URL']);
        }
        complist.push([liberator.buffer.URL, 'Raw URL']); 
        return [0, complist];
    }
}
);

liberator.mappings.addUserMap([liberator.modes.NORMAL], 
['<C-z>'], 'Post to Pukka', 
function() {
    var urlarg = window.eval(liberator.globalVariables.pukka_normalizelink) ?
                 getNormalizedPermalink(liberator.buffer.URL) :
                 liberator.buffer.URL ;
    liberator.commandline.open(
        ':',
        'pukka ' + urlarg,
        liberator.modes.EX
    );
},{
}
);

// copied from trapezoid's direct-hb.js
function getNormalizedPermalink(url){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","http://api.pathtraq.com/normalize_url?url=" + url,false);
    xhr.send(null);
    if(xhr.status != 200){
        liberator.echoerr("Pathtraq: URL normalize faild!!");
        return url;
    }
    return xhr.responseText;
}
})();
