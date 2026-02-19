
"""
Custom Framework Detector Extension
===================================

This module extends the core FrameworkDetector to add support for:
- Odoo (v8-18)
- Classic PHP Frameworks (CodeIgniter 3, Yii 1/2)
"""

import sys
from pathlib import Path

# Add project root to path to import core modules
# Assuming this file is in PRPs-Framework/apps/extensions/
PROJECT_ROOT = Path(__file__).parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

try:
    from apps.backend.project.framework_detector import FrameworkDetector
    from apps.backend.project.analyzer import ProjectAnalyzer
except ImportError:
    # Fallback if running from a different context
    try:
        from backend.project.framework_detector import FrameworkDetector
        from backend.project.analyzer import ProjectAnalyzer
    except ImportError:
        # Fallback if running from root with module style
        from PRPs_Framework.apps.backend.project.framework_detector import FrameworkDetector
        from PRPs_Framework.apps.backend.project.analyzer import ProjectAnalyzer


class CustomFrameworkDetector(FrameworkDetector):
    """Extended detector with support for Odoo and legacy PHP frameworks."""

    def detect_all(self) -> list[str]:
        """
        Run all detection methods (core + custom).
        """
        # Run core detections first
        super().detect_all()
        
        # Run custom detections
        self.detect_odoo_frameworks()
        self.detect_legacy_php_frameworks()
        
        return self.frameworks

    def detect_odoo_frameworks(self) -> None:
        """Detect Odoo versions and structures."""
        has_manifest = False
        is_legacy = False
        
        # Check for __manifest__.py (Odoo 10+)
        if self.parser.file_exists("**/__manifest__.py"):
            has_manifest = True

        # Check for __openerp__.py (Odoo 8-9)
        if self.parser.file_exists("**/__openerp__.py"):
            has_manifest = True
            is_legacy = True

        # Check for odoo.conf
        if self.parser.file_exists("odoo.conf", "*.conf"):
            # Read conf to confirm it's odoo
            try:
                for conf in self.parser.glob_files("*.conf"):
                    content = Path(conf).read_text(encoding="utf-8", errors="ignore")
                    if "[options]" in content and "addons_path" in content:
                        has_manifest = True
                        break
            except Exception:
                pass

        if has_manifest:
            if "odoo" not in self.frameworks:
                self.frameworks.append("odoo")
            # If we detected legacy manifest
            if is_legacy and "odoo-8" not in self.frameworks:
                self.frameworks.append("odoo-8")

    def detect_legacy_php_frameworks(self) -> None:
        """Detect legacy PHP frameworks (CodeIgniter, Yii)."""
        # CodeIgniter 3
        # Characteristic: application/config/config.php AND system/core/CodeIgniter.php
        if (self.parser.file_exists("application/config/config.php") and 
            self.parser.file_exists("system/core/CodeIgniter.php")):
            if "codeigniter" not in self.frameworks:
                self.frameworks.append("codeigniter")
            
        elif self.parser.file_exists("application/config/config.php") and self.parser.file_exists("index.php"):
             # Heuristic for CI
             content = self.parser.read_text("index.php")
             if content and "Checking for standard libraries" in content: # CI 2.x/3.x comment
                 if "codeigniter" not in self.frameworks:
                    self.frameworks.append("codeigniter")

        # Yii 1
        if self.parser.file_exists("framework/yii.php"):
            if "yii" not in self.frameworks:
                self.frameworks.append("yii")
            
        # Yii 2 (Basic/Advanced Template without composer detection)
        if self.parser.file_exists("yii") and self.parser.file_exists("web/index.php"):
            # Check for yii reference
            content = self.parser.read_text("web/index.php")
            if content and "yii2" in content.lower():
                 if "yii" not in self.frameworks:
                    self.frameworks.append("yii")


class CustomProjectAnalyzer(ProjectAnalyzer):
    """
    ProjectAnalyzer that uses CustomFrameworkDetector.
    """
    
    def _detect_frameworks(self) -> None:
        """Detect frameworks using the CustomFrameworkDetector."""
        detector = CustomFrameworkDetector(self.project_dir)
        self.profile.detected_stack.frameworks = detector.detect_all()
