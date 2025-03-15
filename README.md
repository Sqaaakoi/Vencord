# Vencord (Sqaaakoi's personal fork)

The cutest Discord client mod, now with quality of life additions and other things I find useful

# Relation to upstream

This repository is a fork of [Vencord](https://github.com/Vendicated/Vencord).
New contributions will not be submitted upstream, as I am distancing myself from the upstream project.
Existing features will be maintained, and new changes from upstream will be merged in locally, albeit less frequently than before. 

## Features

This is a list of features in this fork.
Last updated 16th March 2025.

All of these plugins have their own branch in the repository. If you want to add them to your own fork, consider adding this repository as a remote and merging the changes into your branch.

### My plugins

-   AskMeToMute
    -   Mute yourself when moderators server mute you, and automatically remove your server mute if you have permission.
-   AutoMute
    -   Automatically mute yourself if you're silent for too long
-   AutomodIndicator
    -   Adds an indicator in servers where AutoMod or explicit image filtering is enabled
-   BetterQuickReact (PR submitted to upstream)
    -   Customise the emoji grid size visible in the message context menu
    -   Sort by frequently used instead of favourites first (originally developed by Vee)
-   ContextMenuSelectFix
    -   Allows you to hold right click to open a context menu and then drag your mouse to the item and release to click it
-   ForwardHere
    -   Adds the current channel to the top of the forward menu
    -   Optionally also adds the message author near the top of the list
-   KeepDMsInSidebar
    -   Pin direct messages to the guild sidebar
    -   Can be filtered to online users/groups only
    -   Recent messages can also be displayed
    -   Trivia: This plugin was originally developed during the June 2024 bundler changes
-   ModernTitlebar
    -   Adds a thicker, more modern looking titlebar to Discord
    -   Not compatible with Visual Refresh
    -   Contains many useful buttons, including voice controls
    -   Can replace ServerListIndicators
-   PollCommands
    -   Adds a /pollyn command to create a Yes/No poll
-   PopoutWindowKeyInjector
    -   Adds the window key to popout windows as a URL fragment
    -   Only supported and useful in browsers as a developer utility
-   ProfileCommand
    -   Adds a /profile command to open someone's profile
-   ScreenshareCrashFix
    -   Fixes the unknown resolution/frame rate crash when watching someone's stream
-   SimplifiedProfileNotes
    -   Re-adds the notes text box to profile popouts
-   SwitchProfileButton
    -   Moves the View Main/Server Profile button out of the overflow menu
-   NewPluginsManager
    -   Notifies you when new plugins are added, or when plugin settings are added
    -   Enabled by default
    -   Available as a [userplugin](https://github.com/Sqaaakoi/vc-newPluginsManager) (for easy standalone installation)
-   JunkCleanup
    -   Removes a LOT of annoyances from Discord
    -   See the [README](https://github.com/Sqaaakoi/vc-junkCleanup/blob/main/README.md#removed-junk) for more information
    -   Available as a [userplugin](https://github.com/Sqaaakoi/vc-junkCleanup) (for easy standalone installation)
-   ShyTyping
    -   Prevents you from accidentally revealing that you're lurking in a channel
    -   Available as a [userplugin](https://git.nin0.dev/Sqaaakoi-VencordUserPlugins) (for easy standalone installation)
-   SqaaakoiForkSupport
    -   Adds a welcome/changelog modal
    -   Warns you about asking for support with my plugins in the Vencord support channel
    -   You probably don't want this in your own fork. Do not blindly merge all my changes into your own fork because of this.

### My unmaintained plugins

-   PreSendModeration
    -   Confirms that you want to send inappropriate content.
    -   Lists sourced from keyword filter experiment
    -   Unmaintained due to breakage. Do not enable. You will not be able to send messages

### Modified plugins

-   ShowHiddenThings
    -   Added a few new settings
        -   Always showing the members page in server settings
        -   Always showing the members page in the sidebar
        -   Picker for your non-Nitro banner color in the profile editor when you have Nitro

### Unmaintained modified plugins
    
-   ShowTimeoutDetails (modified version of ShowTimeoutDuration)
    -   Adds a popout showing more details about a timeout
        -   Remaining time
        -   Moderator
        -   Channel where offending message was sent (AutoMod)
        -   AutoMod rule
        -   Reason
        -   Remove timeout button
    -   Timeout indicator is shown as orange when the timeout was caused by AutoMod

### Less notable plugin changes (where I haven't added myself to developers for these plugins)

-   NoTrack
    -   Disable Sentry in native by preventing the `@sentry/electron` package from loading 
-   MutualGroupDMs
    -   Fix bug where mutual groups wouldn't show in DM sidebar when user has no mutual friends or servers
    -   https://github.com/Vendicated/Vencord/pull/2976
-   NoDevtoolsWarning
    -   Mark as required on Vesktop
-   ThemeAttributes
    -   Adds `streamer-mode` class on the root `html` element to indicate Streamer Mode is enabled
    -   https://github.com/Vendicated/Vencord/pull/2696

### Other non-mainline plugins

See the [git submodules list](./gitmodules) for a list of user plugins

-   ShowMessageEmbeds (by Suffocate)
    -   Adds a context menu option to show embeds for links that don't have one.
    -   https://github.com/Vendicated/Vencord/pull/3004

## Installing

See the [developer installation guide](https://docs.vencord.dev/installing/), except clone this repository instead of upstream.

Please DO NOT ask upstream Vencord for support with installing this.

## Support

There is no Discord server for help. Please [create an issue](https://github.com/Sqaaakoi/Vencord/issues/new/choose) instead.

Friends may DM me on Discord for help, but please do not expect a response.

## Disclaimer

### THIS FORK IS NOT SUPPORTED BY THE UPSTREAM VENCORD PROJECT.<br>THE DAYCARE CHANNEL IS NOT GOING TO HELP YOU WITH THIS FORK.

Explode.

<details>
<summary>Using Vencord violates Discord's terms of service</summary>

Client modifications are against Discord’s Terms of Service.

However, Discord is pretty indifferent about them and there are no known cases of users getting banned for using client mods! So you should generally be fine as long as you don’t use any plugins that implement abusive behaviour. But no worries, all inbuilt plugins are safe to use!

Regardless, if your account is very important to you and it getting disabled would be a disaster for you, you should probably not use any client mods (not exclusive to Vencord), just to be safe

Additionally, make sure not to post screenshots with Vencord in a server where you might get banned for it

</details>
