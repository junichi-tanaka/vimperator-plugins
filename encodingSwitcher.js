/**
 * encodingSwithcer (vimperator plugin)
 * @author teramako teramako@gmail.com
 * @version 0.1
 *
 * Usage:
 *
 * change encoding
 * :set fileencoding = {encodeName}
 * :set fenc = {encodeName}
 *
 * list available encodings
 * :listencoding [expr]
 * :lsenc [expr]
 *
 * change auto detector
 * :set autodetector = {detectorName}
 * :set audet = {detectorName}
 *
 * list available auto detectors
 * :listdetector [expr]
 * :lsdet [expr]
 */
(function(){

var encodings = [];
var detectors = [];
const Cc = Components.classes;
const Ci = Components.interfaces;
if (!RDF) var RDF = Cc['@mozilla.org/rdf/rdf-service;1'].getService(Ci.nsIRDFService);
if (!RDFCU) var RDFCU = Cc['@mozilla.org/rdf/container-utils;1'].getService(Ci.nsIRDFContainerUtils);
var cm = RDF.GetDataSource('rdf:charset-menu');
var sbService = Cc['@mozilla.org/intl/stringbundle;1'].getService(Ci.nsIStringBundleService);
var sbCharTitle = sbService.createBundle('chrome://global/locale/charsetTitles.properties');
CreateMenu('browser');
CreateMenu('more-menu');
var allEnum = cm.GetAllResources();
while (allEnum.hasMoreElements()){
	var res = allEnum.getNext().QueryInterface(Ci.nsIRDFResource);
	var value = res.Value;
	if (RDFCU.IsContainer(cm, res) || value.indexOf('charset.') == 0 || value.indexOf('----') == 0) {
		continue;
	}
	var label = sbCharTitle.GetStringFromName(value.toLowerCase() + '.title');
	if (res.Value.indexOf('chardet.') == 0){
		value = value.substr('chardet.'.length);
		var buf = createDetector(value);
		buf[1] = label;
		detectors.push(buf);
	} else {
		encodings.push([value,label]);
	}
}
function createDetector(name){
	var i = name.indexOf('_');
	if ( i > 0 ){
		return [name.substr(0,i),null,name.substr(i)];
	}
	return [name,null,''];
}
function getDetector(name){
	for (var i=0; i<detectors.length; i++){
		if (detectors[i][0].toLowerCase() == name.toLowerCase()){
			return detectors[i][0] + detectors[i][2];
		}
	}
}
function getEncoding(name){
	for (var i=0; i<encodings.length; i++){
		if (encodings[i][0].toLowerCase() == name.toLowerCase()){
			return encodings[i][0];
		}
	}
}
function isValid(array, value){
	return array.some(function(v){
		return v[0].toLowerCase() == value.toLowerCase();
	});
}
function completion(array, filter){
	if (!filter) return array;
	filter = filter.toLowerCase();
	return array.filter(function(v){
		return v[0].toLowerCase().indexOf(filter) == 0;
	});
}
var sbCharDefault = sbService.createBundle(gPrefService.getDefaultBranch('intl.charset.').getCharPref('default'));
const DEFAULT_CHARSET = sbCharDefault.GetStringFromName('intl.charset.default');
liberator.options.add(['fileencoding','fenc'],'set the charactor encoding for the current page','string', DEFAULT_CHARSET,
	{
		setter: function(value){
			if (!value) return;
			value = getEncoding(value);
			SetForcedCharset(value);
			//SetDefaultCharacterSet(value);
			BrowserSetForcedCharacterSet(value);
		},
		getter: function(){
			return getBrowser().docShell.QueryInterface(Ci.nsIDocCharset).charset;
		},
		validator: function(value){
			return isValid( encodings, value);
		},
		completer: function(filter){
			return [0,completion( encodings, filter)];
		}
	}

);
var sbCharDetector = sbService.createBundle(gPrefService.getDefaultBranch('intl.charset.').getCharPref('detector'));
const DEFAULT_DETECTOR = createDetector(sbCharDetector.GetStringFromName('intl.charset.detector'))[0];
liberator.options.add(['autodetector','audet'],'set auto detect character encoding','string',DEFAULT_DETECTOR,
	{
		setter: function(value){
			SetForcedDetector(true);
			var pref = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch);
			var str = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
			if (!value || value == 'off') {
				str.data = '';
			} else {
				str.data = value = getDetector(value);
			}
			pref.setComplexValue('intl.charset.detector',Ci.nsISupportsString, str);
			BrowserSetForcedCharacterSet(value);
		},
		getter: function(){
			var elms = document.getElementById('charsetMenu').getElementsByAttribute('checed','true');
			for (var i=0; i<elms.length; i++){
				if (elms[i].getAttribute('name') == 'detectorGroup'){
					var str = elms[i].getAttribute('id').substr('chardet.'.length);
					return createDetector(str)[0];
				}
			}
		},
		validator: function(value){
			return isValid( detectors, value);
		},
		completer: function(filter){
			return [0,completion( detectors, filter)];
		}
	}

);
function listCharset(arg, current, list){
	if (!arg) arg = '.';
	var reg = new RegExp(arg,'i');
	var str = [];
	str.push('<table>');
	list.forEach(function(i){
		if (reg.test(i[0]) || reg.test(i[1])){
			str.push('<tr>');
			if (current == i[0]){
				str.push('<td class="hl-Title">' + i[0] + '</td><td class="hl-Title">' + i[1] + '</td>');
			} else {
				str.push('<td>' + i[0] + '</td><td>' + i[1] + '</td>');
			}
			str.push('</tr>');
		}
	});
	str.push('</table>');
	liberator.echo( str.join(''), true);
}
liberator.commands.addUserCommand(['listencoding','lsenc'],'list all encodings',
	function(arg){
		listCharset(arg, liberator.options.fileencoding, encodings);
	},{
		completer: function(filter){
			return [0,completion(encodings, filter)];
		}
	}
);
liberator.commands.addUserCommand(['listdetector','lsdet'],'list all auto detectors',
	function(arg){
		listCharset(arg, liberator.options.autodetector, detectors);
	},{
		completer: function(filter){
			return [0,completion(detectors, filter)];
		}
	}
);

})();

// vim: set fdm=marker sw=4 ts=4 et:
