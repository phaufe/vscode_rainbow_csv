var rainbow_client = require('./rainbow_client');


// TODO consider converting part of the html generation code to a static template.html


function escape_html(src) {
    return String(src).replace(/[&<>"'`=\/]/g, function (s) { return entity_map[s]; });
}


function make_html_table(records) {
    result = [];
    // TODO use th elements for header row
    result.push('<table>');
    for (var nr = 0; nr < records.length; nr++) {
        result.push('<tr>');
        for (var nf = 0; nf < records[nr].length; nf++) {
            result.push('<td>');
            result.push(escape_html(records[nr][nf]));
            result.push('</td>');
        }
        result.push('</tr>');
    }
    result.push('</table>');
    return result.join('');
}


function make_html_head(style, script) {
    return '<head><style>' + style + '</style><script>' + script + '</script></head>';
}


function make_html(head, body) {
    return '<!DOCTYPE html><html>' + head + body + '</html>';
}


function make_css() {
    css_rules = [];
    css_rules.push('html * { font-size: 16px !important; }');
    css_rules.push('table { display: block; overflow-x: auto; white-space: nowrap; border-collapse: collapse; }');
    css_rules.push('th, td { border: 1px solid rgb(130, 6, 219); padding: 3px 8px; }');
    css_rules.push('input { margin: 10px; }');
    return css_rules.join('\n');
}


function make_preview(preview_records, origin_server_port) {
    var css_part = make_css();
    
    var client_side_js = rainbow_client.js_template.replace('__EMBEDDED_JS_PORT__', String(origin_server_port));

    var html_head = make_html_head(css_part, client_side_js);

    var html_table = '<h3>Table preview around cursor:</h3>';
    html_table += make_html_table(preview_records);
    var input_html = '<br><br><input type="text" id="rbql_input"><button id="rbql_run_btn">Execute</button>'

    var rbql_dashboard = '<div id="rbql_dashboard" style="display:none">' + html_table + input_html + '</div>';
    var init_running = '<span id="init_running">Connecting to the main VSCode process at http://localhost:__EMBEDDED_JS_PORT__...<br>Please submit a bugreport to https://github.com/mechatroner/vscode_rainbow_csv if this message doesn\'t disappear.<br>You can also try to reopen this preview page.</span>'.replace('__EMBEDDED_JS_PORT__', String(origin_server_port))
    var html_body = '<body>' + init_running + rbql_dashboard + '</body>';

    return make_html(html_head, html_body);
}


module.exports.make_preview = make_preview;
