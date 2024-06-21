# Vencord (Sqaaakoi's personal fork)

The cutest Discord client mod, now with extra silly stuff

For more information and to support the Vencord project, see the **[upstream README](https://github.com/Vendicated/Vencord/blob/main/README.md)**

## Features

This is a list of features in this fork.

## My plugins
-   AutoMute
    -   Automatically mute yourself if you're silent for too long
-   BetterQuickReact (PR submitted to upstream)
    -   Customise the emoji grid size visible in the message context menu
    -   Sort by frequently used instead of favourites first (originally developed by Vee)
-   ContextMenuSelectFix
    -   Allows you to hold right click to open a context menu and then drag your mouse to the item and release to click it
-   ReactCommandReplyFix
    -   Fixes the +:emoji: built-in command to add the emoji to the message you are replying to
-   MoreJumboEmoji
    -   Customise the limit of jumbo emojis!
-   MoreGuildDiscoveryCategories
    -   Adds the non-primary categories to the guild discovery sidebar
-   CSS Snippets
    -   Core feature; similar to Quick CSS but easier to manage multiple snippets of CSS
-   NoDraftLengthLimit
    -   Removes the ~4500 character limit for saved draft messages.
-   ResizableSidebar
    -   Resize the sidebar on the left of your screen.
    -   Right click the invisible handle to reset it.
## My unmaintained plugins
-   VoiceChannelLog (work in progress)
    -   Adds a log for voice channel join/leave/move events.
-   VoiceJoinMessages (work in progress)
    -   Sends you notifications from your friends' DMs when they join a voice channel.
    -   Helpful if you forget to check in and see if your friends are all online in VC.
    -   Useful in case someone wants to talk to you in person and you forgot to mute.
-   ModViewBypass
    -   Allows you to view the experimental Guild Member Mod View sidebar menu without moderator permissions
    -   Useful for telling if someone is a troll who joined and forgot about the guild for months.
    -   A PR was submitted to upstream, however it was closed as functionality was added to the ShowHiddenThings plugin. You should probably use that instead.
## Modified plugins
-   WebKeybinds
    -   Compatibility with BetterChannelTabs
-   TypingIndicator
    -   Adds avatars for users who are typing, enabled by default (PR merged into dev)
-   SupportHelper
    -   Add a mental health disclaimer. [Certified approved funny™️ by at least 25 Vencord users](https://canary.discord.com/channels/1015060230222131221/1032200195582197831/1226274249472348212)
-   MessageTags
    -   Rewrite a lot of the plugin
    -   Add an editor
    -   Add submenu to attachments + menu
    -   Add multiple tags with the same name
-   FriendInvites
    -   Add UI (can be buggy and crash due to webpack jank)
    -   Renames commands to /friend-invites create|list|delete
    -   Adds argument to send invite to chat when creating an invite using the create command
-   MessageClickActions
    -   When editing messages is off, double clicking will reply to your own message
-   VencordToolbox
    -   Add CSS snippets support
## Other non-mainline plugins
-   (Better)ChannelTabs (modified)
    -   Custom fork of ChannelTabs that replaces the stock Discord titlebar
    -   Upstream: https://github.com/sunnniee/Vencord/tree/channeltabs
    -   Contains highly opinionated changes!
    -   Adds keybinds
    -   Adds a home logo button with a mention counter
    -   Fixes tab hitbox size
-   ValidReply
    -   Fixes "Message could not be loaded" upon hovering over the reply
    -   Developed by waresnew
    -   Upstream: https://github.com/waresnew/Vencord/tree/validReply
-   ChineseWhispers
    -   "Translate plugin but 20x more funny"
    -   Developed by Samwich
    -   Upstream: https://github.com/cheesesamwich/Tobleronecord/blob/main/src/tobleroneplugins/ChineseWhispers.ts
    -   Includes a context menu toggle option and append original text setting that isn't included in upstream
-   GifRoulette
    -   Adds a command to send 1-5 random gifs from your favourites, and a one in ten chance to ping the owner of the server
    -   Originally developed by Samwich as a joke from my suggestion; I've made it funnier (worse)
    -   Upstream: https://github.com/cheesesamwich/Tobleronecord/blob/main/src/tobleroneplugins/GifRoulette.tsx

## Installing

See the [developer installation guide](./docs/1_INSTALLING.md).

Please DO NOT ask upstream Vencord for support with installing this.

## Support

There is no formal support for this fork, as I do upstream most features.

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
