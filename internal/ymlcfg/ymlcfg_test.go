package ymlcfg_test

import (
	"testing"

	"github.com/louisdevie/elizalina2/internal/ymlcfg"
)

var data = `
a: text
b: 45
c: [first, second]
d:
  x: 1
  y: 2
  z: 3
`

func TestBindStr(t *testing.T) {
	cfg, err := ymlcfg.FromText([]byte(data))
	if err != nil {
		t.Fatalf("error parsing yaml data: %s", err)
	}

	if a, ok := cfg.Get("a").BindStr(); !ok || a != "text" {
		t.Fatalf("Expected [.a] to be text but got %v", a)
	}

	if b, ok := cfg.Get("b").BindStr(); !ok || b != "45" {
		t.Fatalf("Expected [.b] to be 45 but got %v", b)
	}

	if _, ok := cfg.Get("c").BindStr(); ok {
		t.Fatal("Expected [.c] not to bind but it did")
	}
}

func TestBindStrSeq(t *testing.T) {
	cfg, err := ymlcfg.FromText([]byte(data))
	if err != nil {
		t.Fatalf("error parsing yaml data: %s", err)
	}

	if a, ok := cfg.Get("a").BindStrSeq(); ok {
		if len(a) != 1 || a[0] != "text" {
			t.Fatalf("Expected [.a] to be [text] but got %v", a)
		}
	} else {
		t.Fatal("Expected [.a] to bind but it did not")
	}

	if b, ok := cfg.Get("b").BindStrSeq(); ok {
		if len(b) != 1 || b[0] != "45" {
			t.Fatalf("Expected [.b] to be [45] but got %v", b)
		}
	} else {
		t.Fatal("Expected [.b] to bind but it did not")
	}

	if c, ok := cfg.Get("c").BindStrSeq(); ok {
		if len(c) != 2 || c[0] != "first" || c[1] != "second" {
			t.Fatalf("Expected [.c] to be [first second] but got %v", c)
		}
	} else {
		t.Fatal("Expected [.c] to bind but it did not")
	}
}

func TestBindMap(t *testing.T) {
	cfg, err := ymlcfg.FromText([]byte(data))
	if err != nil {
		t.Fatalf("error parsing yaml data: %s", err)
	}

	if d, ok := ymlcfg.BindMap(cfg.Get("d"), ymlcfg.ConfigValue.BindStr); ok {
		if len(d) != 3 {
			t.Fatalf("Expected [.d] to contain 3 elements but got %v", len(d))
		}
		if d["x"] != "1" {
			t.Fatalf("Expected [.d.x] to be 1 but got %v", d["x"])
		}
		if d["y"] != "2" {
			t.Fatalf("Expected [.d.y] to be 2 but got %v", d["y"])
		}
		if d["z"] != "3" {
			t.Fatalf("Expected [.d.z] to be 3 but got %v", d["z"])
		}
	} else {
		t.Fatal("Expected [.d] to bind but it did not")
	}
}