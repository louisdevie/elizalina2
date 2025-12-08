package project

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/louisdevie/elizalina2/internal/ymlcfg"
)

const NoPrefix = "$"

type Config interface {
	Sources() (map[string][]string, error)
	Ignore() ([]string, error)
	Translations() (string, error)
	// Format() FormatConfig
}

// type FormatConfig interface {
// 	PrintWidth() (int, error)
// 	Inline() (bool, error)
// 	Indent() (int, error)
// 	UseTabs() (bool, error)
// 	MinimumSpacing() (int, error)
// 	MaximumSpacing() (int, error)
// 	CollapseConditionals() (bool, error)
// 	SortMessages() (MessageSort, error)
// }

// type MessageSort uint8

// const (
// 	Append MessageSort = iota
// 	Alphabetical
// 	Source
// )

type ConfigFile struct {
	root ymlcfg.ConfigValue
}

func (cf *ConfigFile) Sources() (value map[string][]string, err error) {
	value, ok := ymlcfg.BindMap(cf.root.Get("sources"), ymlcfg.ConfigValue.BindStrSeq)
	if !ok {
		value[NoPrefix], ok = cf.root.Get("sources").BindStrSeq()
	}
	if !ok {
		err = fmt.Errorf("sources should be a string, a list of strings or a mapping")
	}
	return value, err
}

func (cf *ConfigFile) Ignore() (value []string, err error) {
	value, ok := cf.root.Get("ignore").BindStrSeq()
	if !ok {
		err = fmt.Errorf("ignore should be a string or a list of strings")
	}
	return value, err
}

func (cf *ConfigFile) Translations() (value string, err error) {
	value, ok := cf.root.Get("translations").BindStr()
	if !ok {
		err = fmt.Errorf("translations should be a string")
	}
	return value, err
}

func LoadConfigFile(path string) (Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return &ConfigFile{}, err
	}

	cv, err := ymlcfg.FromText(data)
	if err != nil {
		return &ConfigFile{}, err
	}

	return &ConfigFile{root: cv}, err
}

const stdConfigFileName = "elz.config.yml"

func FindConfigFile(path string) (file string, found bool) {
	path, err := filepath.Abs(path)
	if err != nil {
		panic(err)
	}
	for !found {
		expectedConfig := filepath.Join(path, stdConfigFileName)
		_, err := os.Stat(path)
		if errors.Is(err, os.ErrNotExist) {
			parent := filepath.Dir(path)
			if parent == path {
				break
			}
			path = parent
		} else {
			file = expectedConfig
			found = true
		}
	}
	return file, found
}
