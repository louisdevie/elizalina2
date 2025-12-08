package project_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/louisdevie/elizalina2/internal/project"
)

func TestParseFullConfig(t *testing.T) {
	cfg, err := project.LoadConfigFile("./testdata/full.yml")
	if err != nil {
		t.Fatalf("error reading full.yml config file: %s", err)
	}

	sources, err := cfg.Sources()
	if err != nil {
		t.Fatalf("invalid [.sources] value: %s", err)
	}
	if len(sources) != 2 {
		t.Fatalf("expected [.sources] to contain 2 entries but got %v", len(sources))
	}
	if len(sources["a"]) != 1 || sources["a"][0] != "src/a" {
		t.Fatalf("expected [.sources.a] to be [src/a] but got %v", sources["a"])
	}
	if len(sources["b"]) != 2 || sources["b"][0] != "src/b/index.ts" || sources["b"][1] != "src/b/other.ts" {
		t.Fatalf("expected [.sources.b] to be [src/b/index.ts src/b/other.ts] but got %v", sources["b"])
	}

	ignore, err := cfg.Ignore()
	if err != nil {
		t.Fatalf("invalid [.ignore] value: %s", err)
	}
	if len(ignore) != 1 || ignore[0] != "src/**.jsx" {
		t.Fatalf("expected [.ignore] to be [src/**.jsx] but got %v", ignore)
	}

	translations, err := cfg.Translations()
	if err != nil {
		t.Fatalf("invalid [.translations] value: %s", err)
	}
	if translations != "src/lang" {
		t.Fatalf("expected [.translations] to be src/lang but got %v", translations)
	}
}

func TestParsePartialConfig(t *testing.T) {
	cfg, err := project.LoadConfigFile("./testdata/partial.yml")
	if err != nil {
		t.Fatalf("error reading partial.yml config file: %s", err)
	}

	sources, err := cfg.Sources()
	if err != nil {
		t.Fatalf("invalid [.sources] value: %s", err)
	}
	if len(sources) != 1 {
		t.Fatalf("expected [.sources] to contain 1 entry but got %v", len(sources))
	}
	if len(sources[project.NoPrefix]) != 1 || sources[project.NoPrefix][0] != "src/" {
		t.Fatalf("expected [.sources.$] to be [src/] but got %v", sources[project.NoPrefix])
	}

	ignore, err := cfg.Ignore()
	if err != nil {
		t.Fatalf("invalid [.ignore] value: %s", err)
	}
	if len(ignore) != 0 {
		t.Fatalf("expected [.ignore] to be [] but got %v", ignore)
	}

	translations, err := cfg.Translations()
	if err != nil {
		t.Fatalf("invalid [.translations] value: %s", err)
	}
	if translations != "src/lang" {
		t.Fatalf("expected [.translations] to be src/lang but got %v", translations)
	}
}

func TestFindConfigFile(t *testing.T) {
  cwd, err := os.Getwd()
  if err != nil {
    panic(err)
  }

  path, found := project.FindConfigFile("./testdata")
  if !found {
    t.Fatal("could not find config file starting from ./testdata")
  }
  path, err = filepath.Rel(cwd, path)
  if err != nil {
    panic(err)
  }
  if path != "testdata/elz.config.yml" {
    t.Fatalf("expected config file to be at testdata/elz.config.yml but got %v", path)
  }

  path, found = project.FindConfigFile("./testdata/nested/dir")
  if !found {
    t.Fatal("could not find config file starting from ./testdata/nested/dir")
  }
  path, err = filepath.Rel(cwd, path)
  if err != nil {
    panic(err)
  }
  if path != "testdata/elz.config.yml" {
    t.Fatalf("expected config file to be at testdata/elz.config.yml but got %v", path)
  }
}

