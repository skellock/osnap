# :camera: osnap!

A CLI for grabbing ios/android screenshots and saving to your clipboard or filesystem.

<img src='https://raw.githubusercontent.com/skellock/osnap/master/osnap-demo.gif' />

# :writing_hand: Usage

```sh
osnap [ios|android] [-f filename.png] [-d android_device_id]
```

:apple: With iOS
```sh
osnap ios
osnap ios -f sweet.png
```

:robot: With Android
```sh
osnap android
osnap android -f cool.png
osnap android -f omg.png -d emulator-5554
```

# :golfing_woman: Installing

```sh
npm i -g osnap
```

# :baby_bottle: Requirements

* macos 10.10 and up
* node 6 and up
* either android or xcode toolchains

# :star2: Inspired By

* http://www.alecjacobson.com/weblog/?p=3816
* https://gist.github.com/mwender/49609a18be41b45b2ae4

# :policeman: License

MIT

# :dizzy: Change Log

See the [Releases](https://github.com/skellock/osnap/releases) section.
