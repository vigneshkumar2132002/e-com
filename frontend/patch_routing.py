import os
import re

directories = [
    r"D:\e-com\e-com\frontend\src\pages",
    r"D:\e-com\e-com\frontend\src\components"
]

def patch_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    original = content
    
    # 1. Add 'use client' at the top if it uses React hooks or React Router hooks
    needs_client = re.search(r'\b(useState|useEffect|useContext|useParams|useLocation|useNavigate|useRouter|motion|AnimatePresence)\b', content)
    if needs_client and not content.startswith("'use client'") and not content.startswith('"use client"'):
        content = "'use client';\n" + content

    # 2. Replace react-router-dom imports
    def rrd_replace(match):
        imports_str = match.group(1)
        imported_tokens = [t.strip() for t in re.split(r',', imports_str) if t.strip()]
        
        next_imports = []
        if 'Link' in imported_tokens:
            next_imports.append("import Link from 'next/link';")
            
        nav_imports = []
        if 'useNavigate' in imported_tokens:
            nav_imports.append('useRouter')
        if 'useLocation' in imported_tokens:
            nav_imports.append('usePathname')
        if 'useParams' in imported_tokens:
            nav_imports.append('useParams')
            
        if nav_imports:
            next_imports.append(f"import {{ {', '.join(nav_imports)} }} from 'next/navigation';")
            
        remaining = [t for t in imported_tokens if t not in ['Link', 'useNavigate', 'useLocation', 'useParams']]
        if remaining:
            next_imports.append(f"import {{ {', '.join(remaining)} }} from 'react-router-dom';")
            
        return '\n'.join(next_imports)

    content = re.sub(
        r"import\s+\{\s*([^}]+)\s*\}\s+from\s+['\"]react-router-dom['\"];?",
        rrd_replace,
        content
    )

    # 3. Replace hook calls
    content = re.sub(
        r"\bconst\s+navigate\s*=\s*useNavigate\(\s*\)\s*;?",
        "const router = useRouter();",
        content
    )
    content = re.sub(
        r"\bnavigate\(([^)]+)\)",
        r"router.push(\1)",
        content
    )
    
    # useLocation replacement
    content = re.sub(
        r"\bconst\s+location\s*=\s*useLocation\(\s*\)\s*;?",
        "const pathname = usePathname();\n  const location = { pathname };",
        content
    )

    if content != original:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Patched: {filepath}")
        except Exception as e:
            print(f"Error writing {filepath}: {e}")

if __name__ == '__main__':
    for d in directories:
        if os.path.exists(d):
            for root, _, files in os.walk(d):
                for file in files:
                    if file.endswith(('.jsx', '.tsx', '.js', '.ts')):
                        patch_file(os.path.join(root, file))
        else:
            print(f"Directory not found: {d}")
