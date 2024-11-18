# Vencord (Sqaaakoi's personal fork)

The cutest Discord client mod, now with niche quality of life additions

For more information about Vencord, see the **[upstream README](https://github.com/Vendicated/Vencord/blob/main/README.md)**

## Features

This is a list of features in this fork.
Last updated 18th November 2024.

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
-   PollCommands
    -   Adds a /pollyn command to create a Yes/No poll
-   PreSendModeration
    -   Confirms that you want to send inappropriate content.
    -   List is sourced from the list Discord uses for the client side keyword filter
-   ProfileCommand
    -   Adds a /profile command to open someone's profile
-   ScreenshareCrashFix
    -   Fixes the unknown resolution/frame rate crash when watching someone's stream
-   ServerTemplatesList
    -   Customise the list of server templates
    -   Imports server templates from servers you are in
    -   Can be filtered to templates from your servers only
    -   Option to skip the useless creation intent page
    -   Default templates can be hidden or placed below your templates
-   SimplifiedProfileNotes
    -   Re-adds the notes text box to profile popouts
-   NewPluginsManager
    -   Notifies you when new plugins are added, or when plugin settings are added
    -   Enabled by default
    -   Available as a [userplugin](https://github.com/Sqaaakoi/vc-newPluginsManager) (for easy standalone installation)
-   JunkCleanup
    -   Removes a LOT of annoyances from Discord
    -   See the [README](https://github.com/Sqaaakoi/vc-junkCleanup/blob/main/README.md#removed-junk) for more information
    -   Available as a [userplugin](https://github.com/Sqaaakoi/vc-junkCleanup) (for easy standalone installation)
### My unmaintained plugins
-   ResizableSidebar
    -   Resize the sidebar on the left of your screen.
    -   Right click the invisible handle to reset it.
    -   Unmaintained due to breakage. Not recommended to enable
-   ShakingText
    -   Adds a markdown rule for text that shakes around
    -   Code taken from the 3rd party WigglyText plugin (https://github.com/nexpid/WigglyText)
    -   Unmaintained as it's way too niche, and it's somehow incompatible with the WigglyText plugin
### Modified plugins
-   ShowHiddenThings
    -   Added a few new settings
        -   Always showing the members page in server settings
        -   Always showing the members page in the sidebar
        -   Picker for your non-Nitro banner color in the profile editor when you have Nitro
-   ShowTimeoutDetails (modified version of ShowTimeoutDuration)
    -   Adds a popout showing more details about a timeout
        -   Remaining time
        -   Moderator
        -   Channel where offending message was sent (AutoMod)
        -   AutoMod rule
        -   Reason
        -   Remove timeout button
    -   Timeout indicator is shown as orange when the timeout was caused by AutoMod

### Other non-mainline plugins

See the [git submodules list](./gitmodules) for a list of user plugins


## Installing

See the [developer installation guide](https://docs.vencord.dev/installing/), except clone this repository instead of upstream.

Please DO NOT ask upstream Vencord for support with installing this.

## Support

There is no formal support for this fork.

Some support is informally offered to friends. Friends may DM me on Discord for this.

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
