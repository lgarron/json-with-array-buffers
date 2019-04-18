require("base64")
require("json")

# TODO: Escape existing data with conflicting keys.

class BinaryInJSON
  def initialize(binary_string)
    @binary_string = binary_string
  end
  def to_json(state)
    {
      "_type": "Uint8Array",
      "_encoding": "base64",
      "value": Base64.strict_encode64(@binary_string)
    }.to_json 
  end
  def to_s
    return @binary_string
  end
end

module JSONWithBinary
  def self.convert(v)
    case v
      when Array
        v.map {|e| convert e}
      when Hash
        if v["_encoding"] == "base64" && v["_type"] == "Uint8Array"
          return Base64.strict_decode64(v["value"]) # self.BinaryInJSON.new 
        end
        if v["_encoding"] == "none"
          return convert(v["value"])
        end
        return v.transform_values convert
      else
        v
    end
  end
  def self.from_json(s)
    convert JSON.parse(s)
  end
end

a = [4, BinaryInJSON.new("hi there")]
puts a
s = JSON.dump a
puts s
puts JSONWithBinary.from_json s
