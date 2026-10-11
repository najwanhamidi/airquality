# Build script to generate standalone_mobile.html and github_pages_mobile/index.html
# by inlining mobile.css and mobile.js into mobile.html

def build():
    with open('mobile.html', 'r', encoding='utf-8') as f:
        html = f.read()

    with open('mobile.css', 'r', encoding='utf-8') as f:
        css = f.read()

    with open('mobile.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Verify targets exist
    target_css = '<link rel="stylesheet" href="mobile.css">'
    target_js = '<script src="mobile.js"></script>'

    if target_css not in html:
        raise ValueError("Could not find mobile.css link tag in mobile.html")
    if target_js not in html:
        raise ValueError("Could not find mobile.js script tag in mobile.html")

    bundled = html.replace(target_css, f"<style>\n{css}\n</style>")
    bundled = bundled.replace(target_js, f"<script>\n{js}\n</script>")

    with open('standalone_mobile.html', 'w', encoding='utf-8') as f:
        f.write(bundled)
    print("Updated standalone_mobile.html successfully.")

    import os
    if os.path.exists('github_pages_mobile'):
        with open('github_pages_mobile/index.html', 'w', encoding='utf-8') as f:
            f.write(bundled)
        print("Updated github_pages_mobile/index.html successfully.")

if __name__ == '__main__':
    build()
