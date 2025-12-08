package ymlcfg

import (
	"fmt"

	"gopkg.in/yaml.v3"
)

type ConfigValue interface {
	Get(key string) ConfigValue
	BindStr() (string, bool)
	BindStrSeq() ([]string, bool)
	BindMap(iter func(key string, value ConfigValue)) bool
}

type configNil struct{}

func (cfg *configNil) Get(key string) ConfigValue {
	return cfg
}

func (cfg *configNil) BindStr() (string, bool) {
	return "", true
}

func (cfg *configNil) BindStrSeq() ([]string, bool) {
	return nil, true
}

func (cfg *configNil) BindMap(iter func(key string, value ConfigValue)) bool {
	return false
}

type configScalar struct {
	node  *yaml.Node
	bound bool
}

func (cfg *configScalar) Get(key string) ConfigValue {
	return &configNil{}
}

func (cfg *configScalar) BindStr() (string, bool) {
	return cfg.node.Value, true
}

func (cfg *configScalar) BindStrSeq() ([]string, bool) {
	return []string{cfg.node.Value}, true
}

func (cfg *configScalar) BindMap(iter func(key string, value ConfigValue)) bool {
	return false
}

type configSequence struct {
	node   *yaml.Node
	bound  bool
	values []ConfigValue
}

func (cfg *configSequence) Get(key string) ConfigValue {
	return &configNil{}
}

func (cfg *configSequence) BindStr() (string, bool) {
	return "", false
}

func (cfg *configSequence) BindStrSeq() ([]string, bool) {
	values := make([]string, len(cfg.values))
	for i, val := range(cfg.values) {
		ok := true
		values[i], ok = val.BindStr()
		if !ok {
			return nil, false
		}
	}
	return values, true
}

func (cfg *configSequence) BindMap(iter func(key string, value ConfigValue)) bool {
	return false
}

type configMappingEntry struct {
	keyNode *yaml.Node
	bound   bool
	value   ConfigValue
}

type configMapping struct {
	node    *yaml.Node
	bound   bool
	entries map[string]configMappingEntry
}

func (cfg *configMapping) Get(key string) ConfigValue {
	cfg.bound = true
	entry := cfg.entries[key]
	if entry.value == nil {
		return &configNil{}
	} else {
		return entry.value
	}
}

func (cfg *configMapping) BindStr() (string, bool) {
	return "", false
}

func (cfg *configMapping) BindStrSeq() ([]string, bool) {
	return nil, false
}

func (cfg *configMapping) BindMap(iter func(key string, value ConfigValue)) bool {
	for key, entry := range cfg.entries {
		iter(key, entry.value)
	}
	return true
}

type configDocument struct {
	node    *yaml.Node
	bound   bool
	content ConfigValue
}

func (cfg *configDocument) Get(key string) ConfigValue {
	cfg.bound = true
	return cfg.content.Get(key)
}

func (cfg *configDocument) BindStr() (string, bool) {
	cfg.bound = true
	return cfg.content.BindStr()
}

func (cfg *configDocument) BindStrSeq() ([]string, bool) {
	cfg.bound = true
	return cfg.content.BindStrSeq()
}

func (cfg *configDocument) BindMap(iter func(key string, value ConfigValue)) bool {
	cfg.bound = true
	return cfg.content.BindMap(iter)
}

func FromNode(data *yaml.Node) (ConfigValue, error) {
	var (
		cfg ConfigValue
		err error
	)
	switch data.Kind {
	case yaml.DocumentNode:
		document := configDocument{node: data}
		if len(data.Content) > 0 {
			document.content, err = FromNode(data.Content[0])
		}
		cfg = &document

	case yaml.ScalarNode:
		scalar := configScalar{node: data}
		cfg = &scalar

	case yaml.SequenceNode:
		sequence := configSequence{node: data}
		var value ConfigValue
		for _, node := range data.Content {
			value, err = FromNode(node)
			if err != nil {
				break
			}

			sequence.values = append(sequence.values, value)
		}
		cfg = &sequence

	case yaml.MappingNode:
		mapping := configMapping{
			node:    data,
			entries: make(map[string]configMappingEntry, len(data.Content)/2),
		}
		var entry configMappingEntry
		for _, node := range data.Content {
			if entry.keyNode == nil {
				entry.keyNode = node
			} else {
				var key string
				if entry.keyNode.ShortTag() == "!!str" {
					key = entry.keyNode.Value
				} else {
					err = fmt.Errorf("unable to map node %v into a config key", *entry.keyNode)
				}
				if err != nil {
					break
				}

				entry.value, err = FromNode(node)
				if err != nil {
					break
				}

				mapping.entries[key] = entry
				entry = configMappingEntry{}
			}
		}
		cfg = &mapping

	default:
		err = fmt.Errorf("unable to map node %v into a config value", *data)
	}
	return cfg, err
}

func FromText(data []byte) (ConfigValue, error) {
	var rootNode yaml.Node
	err := yaml.Unmarshal(data, &rootNode)
	if err != nil {
		return &configNil{}, err
	}

	return FromNode(&rootNode)
}

func BindMap[V any](cfg ConfigValue, binding func(cfg ConfigValue)(V, bool)) (map[string]V, bool) {
	mapped := make(map[string]V)
	bound := true
	supportsBindMap := cfg.BindMap(func(key string, value ConfigValue) {
		var ok bool
		mapped[key], ok = binding(value)
		bound = bound && ok
	})
	return mapped, supportsBindMap && bound
}