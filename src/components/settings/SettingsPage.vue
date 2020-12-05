<template>
  <v-container fill-height class="">
    <v-layout align-center>
      <v-flex text-xs-center xs12 :md8="!!section" :offset-md2="!!section">
        <template v-if="!section && !setupStep">
          <v-flex xs12 sm8 offset-sm2 lg6 offset-lg3>
            <v-card>
              <div class="blue-grey">
                <v-icon size="200">mdi-information</v-icon>
              </div>
              <v-card-title primary-title>
                <div class="title mb-2">Information</div>
              </v-card-title>
              <v-card-title class="mt-0 pt-0">
                <span class="grey--text"
                  >View the changelog or tutorial here</span
                >
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  flat
                  color="accent"
                  :to="{
                    path: '/settings/setup/1',
                    query: $store.state.routerModule.query,
                  }"
                  >Tutorial</v-btn
                >
                <v-btn
                  flat
                  color="accent"
                  :to="{
                    path: '/about',
                    query: $store.state.routerModule.query,
                  }"
                  >About</v-btn
                >
                <v-btn
                  flat
                  color="accent"
                  :to="{
                    path: '/install',
                    query: $store.state.routerModule.query,
                  }"
                  >Installation</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
          <settings-page-preview
            section="posts"
            ref="posts"
            title="Posts"
            icon="mdi-view-dashboard-variant"
            color="darken-1 green"
            text="Change the post layout and customize the button layout."
          >
            <ul>
              <li>Layout: {{ displaySetting(layoutItems, layout) }}</li>
              <li>
                Button layout:
                {{ displaySetting(compactnessItems, compactness) }}
              </li>
            </ul>
          </settings-page-preview>
          <settings-page-preview
            section="theme"
            ref="theme"
            title="Theme"
            icon="mdi-palette"
            color="darken-1 pink"
            :text="`Change the overall theme of ${$appName}.`"
          >
            <ul>
              <li>
                Current theme:
                {{
                  displaySetting(backgroundItems, backgroundColor) ||
                    "Custom colors"
                }}
              </li>
              <li>Navigation: {{ displaySetting(navItems, nav) }}</li>
            </ul>
          </settings-page-preview>
          <settings-page-preview
            section="downloads"
            ref="downloads"
            title="Downloads"
            icon="mdi-download"
            color="darken-1 cyan"
            text="Change settings related to downloads."
          >
            <ul>
              <li>
                Descriptive names: {{ displaySetting(descriptiveFilenames) }}
              </li>
              <li>
                Concurrent downloads: {{ displaySetting(concurrentDownloads) }}
              </li>
            </ul>
          </settings-page-preview>
          <settings-page-preview
            section="blacklist"
            ref="blacklist"
            title="Blacklist"
            icon="mdi-playlist-remove"
            color="darken-1 red"
            text="Change your blacklist settings."
          >
            <ul>
              <li>Mode: {{ displaySetting(blacklistItems, blacklistMode) }}</li>
            </ul>
          </settings-page-preview>
          <settings-page-preview
            section="loading"
            ref="loading"
            title="Loading"
            icon="mdi-widgets"
            color="darken-1 orange"
            text="Change how posts are loaded."
          >
            <ul>
              <li>Page size: {{ displaySetting(postSlider) }}</li>
              <li>Mobile: {{ displaySetting(lowRes) }}</li>
              <li>Full resolution: {{ displaySetting(fastLoad) }}</li>
              <li>Bottom load: {{ displaySetting(bottomLoad) }}</li>
              <li>Initial page load: {{ displaySetting(autoLoad) }}</li>
              <li>Pagination: {{ displaySetting(pagination) }}</li>
            </ul>
          </settings-page-preview>
          <!-- <settings-page-preview section="search" ref="search" title="Search" icon="mdi-magnify" color="darken-1 blue"
            text="Change settings related to search.">
            <ul>
            </ul>
          </settings-page-preview>-->

          <settings-page-preview
            section="tags"
            ref="tags"
            title="Tags"
            icon="mdi-tag-multiple"
            color="darken-1 purple"
            :text="`Change how ${$appName} suggests tags.`"
          >
            <ul>
              <li>Suggestion count: {{ displaySetting(suggestionSlider) }}</li>
              <li>Tag count per fetch: {{ displaySetting(tagSlider) }}</li>
            </ul>
          </settings-page-preview>
          <settings-page-preview
            section="backup"
            ref="backup"
            title="Backup, restore and synchronize"
            icon="mdi-backup-restore"
            color="darken-1 light-green"
            text="Download or import settings and change how they are synchronized between tabs."
          >
            <ul></ul>
          </settings-page-preview>
          <settings-page-preview
            section="other"
            ref="other"
            title="Other"
            icon="mdi-dots-horizontal"
            color="darken-1 indigo"
            text="Toggle the DText parser."
          >
            <ul>
              <li>DText parser: {{ displaySetting(enableDtext) }}</li>
            </ul>
          </settings-page-preview>
        </template>
        <template v-if="section == 'posts'">
          <settings-section-title title="Posts" color="darken-1 green" />
          <settings-section-item
            title="Layout"
            description="Different view modes"
            select
          >
            <v-select
              :items="layoutItems"
              box
              solo
              v-model="layout"
              hide-details
            ></v-select>
          </settings-section-item>
          <settings-section-item
            title="Information underneath posts and button placement"
            description="Some layouts may require changing this"
            select
          >
            <v-select
              :items="compactnessItems"
              box
              solo
              v-model="compactness"
              hide-details
            ></v-select>
          </settings-section-item>
          <settings-section-item
            title="Fullscreen button placement"
            description="Choose where the buttons are placed when entering fullscreen mode"
            select
          >
            <v-select
              :items="fullscreenModeItems"
              box
              solo
              v-model="fullscreenModeLayout"
              hide-details
            ></v-select>
          </settings-section-item>
          <settings-section-item
            title="Fullscreen next and previous buttons"
            description="Swiping and the arrow keys still work with hidden buttons"
            select
          >
            <v-select
              :items="fullscreenNextPreviousItems"
              box
              solo
              v-model="fullscreenNextPrevious"
              hide-details
            ></v-select>
          </settings-section-item>
          <settings-section-item
            title="Fullscreen image transitions"
            description="Change the image transitions"
            select
          >
            <v-select
              :items="transitionItems"
              box
              solo
              v-model="fullscreenTransition"
              hide-details
            ></v-select>
            <transition-preview
              :transition-name="fullscreenTransition"
              :ratio="16 / 9"
              :directions="[
                'left',
                'right',
                'left',
                'right',
                'left',
                'left',
                'right',
                'right',
              ]"
              class="mt-3"
            />
          </settings-section-item>
          <settings-section-item
            title="Button layout"
            description="Drag to control button order and use the switches to control visibility. The preview updates accordingly"
            select
          >
            <v-card class="pb-3 pl-3 pt-1 elevation-8">
              <post-buttons large />
            </v-card>
            <v-flex>
              <draggable
                v-model="buttonLayout"
                :options="{
                  animation: 200,
                  group: 'description',
                  disabled: false,
                  ghostClass: 'ghost',
                  //dragClass: 'primary',
                  //chosenClass: 'primary',
                  handle: '.list-handle',
                }"
                class="dragArea"
              >
                <transition-group name="list-complete">
                  <template flat v-for="(element, index) in buttonLayout">
                    <v-card
                      style="display:inline-flex; flex-direction: column; transition: all 1s"
                      class="ma-2 pa-2 elevation-8"
                      :key="element.icon"
                    >
                      <span style="display: inline-flex; transition: all 1s">
                        <v-icon class="list-handle">mdi-drag</v-icon>
                        <span>
                          <v-tooltip top open-delay="100" close-delay="100">
                            <v-switch
                              slot="activator"
                              class="ml-2 mr-0 my-0 pa-0"
                              :input-value="element.active"
                              @change="
                                buttonLayout[index].active = $event;
                                buttonLayout = buttonLayout;
                              "
                            ></v-switch>
                            <span>Visibility in post list</span>
                          </v-tooltip>
                          <v-tooltip top open-delay="100" close-delay="100">
                            <v-switch
                              slot="activator"
                              class="ml-2 mr-0 my-0 pa-0"
                              :input-value="element.activeFullscreen"
                              @change="
                                buttonLayout[index].activeFullscreen = $event;
                                buttonLayout = buttonLayout;
                              "
                            ></v-switch>
                            <span>Visibility in fullscreen mode</span>
                          </v-tooltip>
                        </span>
                        <v-btn class="list-complete-item" icon :value="1">
                          <v-icon>{{ element.icon }}</v-icon>
                        </v-btn>
                      </span>
                      <v-card-actions
                        >{{ index + 1 }}.
                        {{ element.description }}</v-card-actions
                      >
                    </v-card>
                  </template>
                </transition-group>
              </draggable>
            </v-flex>
          </settings-section-item>
        </template>
        <template v-if="section == 'theme'">
          <settings-section-title title="Theme" color="darken-1 pink" />
          <settings-section-item
            title="Color theme"
            description="Choose between pre-made and custom themes"
            select
          >
            <v-select
              :items="backgroundItems"
              label="Custom theme"
              box
              solo
              v-model="backgroundColor"
              hide-details
            ></v-select>
          </settings-section-item>
          <settings-section-item
            title="Primary color"
            description="The primary theme color"
            select
          >
            <color-chooser color-key="primary" />
          </settings-section-item>
          <settings-section-item
            title="Secondary color"
            description="The secondary theme color"
            select
          >
            <color-chooser color-key="secondary" />
          </settings-section-item>
          <settings-section-item
            title="Accent color"
            description="The accent theme color"
            select
          >
            <color-chooser color-key="accent" />
          </settings-section-item>
          <settings-section-item
            title="Dark"
            description="The card and text color"
            switch
          >
            <v-switch v-model="isDarkMode"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Background color"
            description="The background color"
            select
          >
            <color-chooser color-key="background" />
          </settings-section-item>
          <settings-section-item
            title="Sidebar color"
            description="The sidebar color"
            select
          >
            <color-chooser color-key="sidebar" />
          </settings-section-item>
          <settings-section-item
            title="Rating background color"
            description="Use red, yellow or green background for explicit, questionable or safe posts"
            switch
          >
            <v-switch v-model="ratingBackground"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Route transitions"
            description="Change the route transitions"
            select
          >
            <v-select
              :items="transitionItems"
              box
              solo
              v-model="transition"
              hide-details
            ></v-select>
            <transition-preview
              :transition-name="transition"
              :ratio="16 / 12"
              :directions="['none', 'right', 'left', 'none']"
              class="mt-3"
            />
          </settings-section-item>
          <settings-section-item
            title="Navigation"
            description="Sidebar or bottom nav"
            select
          >
            <v-select
              :items="navItems"
              box
              solo
              v-model="nav"
              hide-details
            ></v-select>
          </settings-section-item>
          <settings-section-item
            title="Mascot"
            description="Change how the mascot is displayed. If you use a seasonal theme, this will be overwritten."
            select
          >
            <v-select
              :items="mascotItems"
              box
              solo
              v-model="mascot"
              hide-details
            ></v-select>
          </settings-section-item>
        </template>
        <template v-if="section == 'downloads'">
          <settings-section-title title="Downloads" color="darken-1 cyan" />
          <settings-section-item
            title="Descriptive file names"
            description="ID + tags instead of hash"
            switch
          >
            <v-switch v-model="descriptiveFilenames"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Extended download progress"
            description="Show detailed download progress for individual items"
            switch
          >
            <v-switch v-model="downloadProgress"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Concurrent downloads"
            description="Speed up downloads by downloading up to 6 posts at once"
            switch
          >
            <v-switch v-model="concurrentDownloads"></v-switch>
          </settings-section-item>
        </template>
        <template v-if="section == 'blacklist'">
          <settings-section-title title="Blacklist" color="darken-1 red" />
          <settings-section-item
            title="Blacklist mode"
            description="Different modes have different drawbacks"
            select
          >
            <v-select
              :items="blacklistItems"
              box
              solo
              v-model="blacklistMode"
              hide-details
            ></v-select>
            <ul slot="description">
              <li v-for="item in blacklistTable" :key="item.name">
                <b>{{ item.name }}</b>
                <span>{{ item.description }}</span>
                <ul>
                  <li>
                    <b>Upside:</b>
                    {{ item.upside }}
                  </li>
                  <li>
                    <b>Downside:</b>
                    {{ item.downside }}
                  </li>
                  <li>
                    <b>Downloads</b>
                    {{ item.downloads }}
                  </li>
                </ul>
              </li>
            </ul>
          </settings-section-item>
        </template>
        <template v-if="section == 'loading'">
          <settings-section-title title="Loading" color="darken-1 orange" />
          <settings-section-item
            title="Mobile mode"
            description="Displays low resolution images (full resolution images upon click)"
            switch
          >
            <v-switch v-model="lowRes"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Force full resolution images"
            description="Try to load all full resolution images on load instead of on scroll (may require
                page reload when turned on for
                the first time)"
            switch
          >
            <v-switch v-model="fastLoad"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Page size"
            description="Items per load or page in paginated mode"
            select
          >
            <v-slider
              color="accent"
              class="my-0 mx-3"
              v-model="postSlider"
              thumb-label
              :min="10"
              :max="320"
              :rules="notRecommendedRules100"
            ></v-slider>
          </settings-section-item>
          <settings-section-item
            title="Auto load"
            description="Load first page of posts automatically (when opening new page or reloading)."
            switch
          >
            <v-switch v-model="autoLoad"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Bottom auto load"
            description="Load next page when you reach the bottom automatically"
            switch
          >
            <v-switch v-model="bottomLoad"></v-switch>
          </settings-section-item>
          <settings-section-item
            title="Pagination"
            description="Disable infinite scrolling (may prevent lagging on mobile devices)"
            switch
          >
            <v-switch v-model="pagination"></v-switch>
          </settings-section-item>
        </template>
        <!-- <template v-if="section == 'search'">
          <settings-section-title title="Search" color="darken-1 blue" />
        </template>-->

        <template v-if="section == 'tags'">
          <settings-section-title
            title="Tag Suggestions"
            color="darken-1 purple"
          />
          <settings-section-item
            title="Tag count"
            description="Number of tags per load"
            select
          >
            <v-slider
              color="accent"
              class="my-0 mx-3"
              v-model="tagSlider"
              thumb-label
              :min="10"
              :max="50"
            ></v-slider>
          </settings-section-item>
          <settings-section-item
            title="Suggestion count"
            description="Number of suggestions to display"
            select
          >
            <v-slider
              color="accent"
              class="my-0 mx-3"
              v-model="suggestionSlider"
              thumb-label
              :min="5"
              :max="50"
              :step="5"
            ></v-slider>
          </settings-section-item>
          <settings-section-item
            title="Order suggestions by occurence"
            description="Toggles between grouped and ordered suggestions"
            switch
          >
            <v-switch v-model="orderedSuggestions"></v-switch>
          </settings-section-item>
        </template>
        <!-- <template v-if="section == 'shortcuts'">
          <settings-section-title title="Shortcuts" color="darken-1 brown" />
        </template>-->

        <template v-if="section == 'backup'">
          <settings-section-title
            title="Backup, restore and synchronize"
            color="darken-1 light-green"
          />
          <settings-section-item
            :title="`Storage used: ${storageStr}`"
            description="Shows the storage used for cached files, settings and cached tags."
            select
          >
            <v-progress-linear
              color="accent"
              class="ma-1"
              indeterminante
              :value="(storageUsed / (storageTotal || 1)) * 100"
            />
          </settings-section-item>
          <settings-section-item
            title="Backup settings"
            description="Download your settings as JSON file."
            switch
          >
            <v-btn flat color="accent" class="mb-3" @click="backupSettings"
              >download</v-btn
            >
          </settings-section-item>
          <form>
            <settings-section-item
              title="Restore settings"
              description="Upload your settings from a JSON file."
              switch
            >
              <!-- <v-btn flat color="accent" class="mb-3">upload</v-btn> -->
              <input
                ref="settingsImport"
                class="file-btn"
                name="file"
                type="file"
                @change="restoreSettings($event.target.files)"
              />
              <v-btn
                flat
                color="accent"
                class="mb-3"
                @click="() => $refs.settingsImport.click()"
                >upload</v-btn
              >
            </settings-section-item>
          </form>
        </template>
        <!-- <template v-if="section == 'sync'">
          <settings-section-title title="Synchronization" color="darken-1 teal" />
        </template>-->

        <template v-if="section == 'other'">
          <settings-section-title title="Other" color="darken-1 indigo" />
          <settings-section-item
            title="Quick optimization"
            description="Quickly optimize settings for specific use cases"
          >
            <div class="d-flex">
              <v-btn flat color="accent" @click="optimizeMobile">Mobile</v-btn>
              <v-btn flat color="accent" @click="optimizeDesktop"
                >Desktop</v-btn
              >
              <v-btn flat color="accent" @click="optimizeDefault"
                >Default</v-btn
              >
            </div>
          </settings-section-item>
          <settings-section-item
            title="DText parser test page"
            description="Test the DText parser"
            switch
          >
            <v-btn flat color="accent" class="mb-3" @click="goToParser"
              >open</v-btn
            >
          </settings-section-item>
          <settings-section-item
            title="Enable DText parser"
            description="View HTML instead of raw DText"
            switch
          >
            <v-switch v-model="enableDtext" color="accent"></v-switch>
          </settings-section-item>
        </template>
        <template v-if="setupStep">
          <v-stepper v-model="setupStep" vertical non-linear>
            <setup-header
              step="1"
              v-model="setupStep"
              tutorial
              name="Welcome"
              description
            />
            <setup-content step="1" v-model="setupStep">
              <logo mascot />
              <p>
                Hello and welcome to {{ $appName }}! I will be guiding you
                through some features and settings. You will find more
                customization options in the settings section.
              </p>
              <p>
                If you make a mistake (e.g. select a preset that overrides your
                already chosen settings), you can use your browser's back button
                to undo these changes most of the time. You can also create a
                backup in settings.
              </p>
              <p>Let's get started.</p>
            </setup-content>
            <setup-header
              step="2"
              v-model="setupStep"
              name="Preset"
              description="Choose optimized settings for desktop and mobile devices"
            />
            <setup-content step="2" v-model="setupStep">
              <p>
                If you already chose some settings, I recommend not to use these
                presets.
              </p>
              <p>
                Default settings usually work fine for most devices. The mobile
                preset for example changes the navigation to bottom, doesn't
                load full sized pictures by default, enables pagination and some
                other settings. The desktop preset increases page size, loads
                full sized images, turns off pagination, shows all buttons and
                changes a few other settings.
              </p>
              <div class="d-flex">
                <v-btn flat color="accent" @click="optimizeMobile"
                  >Mobile</v-btn
                >
                <v-btn flat color="accent" @click="optimizeDesktop"
                  >Desktop</v-btn
                >
                <v-btn flat color="accent" @click="optimizeDefault"
                  >Default</v-btn
                >
              </div>
            </setup-content>
            <setup-header
              step="3"
              v-model="setupStep"
              name="Post layout"
              description="Change the way posts are displayed"
            />
            <setup-content step="3" v-model="setupStep">
              <p>
                Let's choose how posts are displayed. The blog layout displays
                one post per row with some space around them. The grid layout is
                just a grid with fixed height and width.
              </p>
              <v-select
                :items="layoutItems"
                box
                solo
                v-model="layout"
                hide-details
              ></v-select>
              <p class="mt-3">
                If you chose a layout with small or medium tiles, you should
                change what is displayed underneath the images. More information
                displays stuff like favorites, file type and date. Compact only
                shows the buttons and the rest should be self explanitory.
              </p>
              <v-select
                :items="compactnessItems"
                box
                solo
                v-model="compactness"
                hide-details
              ></v-select>
            </setup-content>
            <setup-header
              step="4"
              v-model="setupStep"
              tutorial
              name="Tags"
              description
            />
            <setup-content step="4" v-model="setupStep">
              <logo mascot />
              <p>Nice to see you again.</p>
              <p>
                You can use almost any
                <external-link href="https://e621.net/help/show/cheatsheet">
                  tag you can use on e621.net </external-link
                >. If you use infinite scrolling (we'll come to that soon), you
                can't use the metatag "order:".
              </p>
              <p>
                Blacklisting works a bit differently. You can't combine multiple
                tags. Furthermore, all metatags except "rating:" don't work.
                Otherwise, the blacklist works as expected.
              </p>
              <p>
                {{ $appName }} also supports tag searching. These tags are color
                coded. You might notice the additional pool tag which is not
                present in e621.
              </p>
              <tag-list-display
                :tags="[
                  { text: 'Artists', color: 'yellow' },
                  { text: 'Characters', color: 'green' },
                  { text: 'Copyright', color: 'purple' },
                  { text: 'Species', color: 'orange' },
                  { text: 'Pools', color: 'pink' },
                  { text: 'General', color: 'grey' },
                ]"
              />
            </setup-content>
            <setup-header
              step="5"
              v-model="setupStep"
              name="Theme"
              description="Select the main colors"
            />
            <setup-content step="5" v-model="setupStep">
              <p>
                Choose the color scheme you want to use. There are also several
                season specific themes like the winter theme. You can change
                individual colors in the theme settings.
              </p>
              <v-select
                :items="backgroundItems"
                box
                solo
                v-model="backgroundColor"
                hide-details
              ></v-select>
            </setup-content>
            <setup-header
              step="6"
              v-model="setupStep"
              name="Navigation"
              description="Navigation panel position"
            />
            <setup-content step="6" v-model="setupStep">
              <p>
                Change where the navigation panel is located. The only
                difference between these is that only the sidebar shows tag
                suggestions.
              </p>
              <v-select
                :items="navItems"
                box
                solo
                v-model="nav"
                hide-details
              ></v-select>
            </setup-content>
            <setup-header
              step="7"
              v-model="setupStep"
              tutorial
              name="Downloads"
              description
            />
            <setup-content step="7" v-model="setupStep">
              <logo mascot />
              <p>
                Using the download button underneath each post, you can download
                it directly. You can also download a ZIP compressed folder of
                the current page in the navigation panel.
              </p>
              <p>
                Due to e621.net now allowing CORS requests, these are downloaded
                using the cors-anywhere proxy. Because of this, you should
                download large files by right clicking/long pressing the
                image/video if you are on a mobile data plan if you want to save
                bandwidth.
              </p>
            </setup-content>
            <setup-header
              step="8"
              v-model="setupStep"
              name="Pagination"
              description="Choose between infinite scrolling and pagination"
            />
            <setup-content step="8" v-model="setupStep">
              <p>
                If you scroll very far down when using infinite scrolling, the
                page might start lagging.
              </p>
              <p>Pagination is currently {{ pagination ? "on" : "off" }}.</p>
              <v-switch v-model="pagination"></v-switch>
            </setup-content>
            <setup-header
              step="9"
              v-model="setupStep"
              name="Blacklist"
              description="Add some tags to your blacklist"
            />
            <setup-content step="9" v-model="setupStep">
              <p>
                Here are some common blacklisted tags to get started. The red
                ones are already blacklisted.
              </p>
              <blacklist-suggestions />
            </setup-content>
            <setup-header
              step="10"
              v-model="setupStep"
              tutorial
              name="Authentication"
            />
            <setup-content step="10" v-model="setupStep">
              <logo mascot />
              <p>
                Adding you account enables you to favorite, comment and bulk
                upload. Just log in at the top right.
              </p>
              <p>
                This app is running inside a browser where it has limited
                permissions. It can't directly communicate with e621 when an API
                endpoint that requires authentication is used, which means that
                the request has to be sent to a third party server which
                forwards it to e621.net. This third party server is
                <external-link href="https://github.com/Rob--W/cors-anywhere"
                  >cors-anywhere</external-link
                >. If you don't trust it, create a second account, use your own
                server or don't use authentication.
              </p>
            </setup-content>
            <setup-header
              step="11"
              v-model="setupStep"
              tutorial
              name="Have fun!"
              description
            />
            <setup-content step="11" v-model="setupStep" last>
              <logo mascot />
              <p>
                I hope I could help you. Have fun exploring the remaining
                features yourself!
              </p>
              <p>
                Do you have a question or a problem? Are you stuck? Get help or
                provide feedback in
                <external-link href="https://e621.net/forum/show/261165"
                  >this forum post</external-link
                >.
              </p>
              <p>
                If you are done exploring and are satisfied with your settings,
                make sure to
                <router-link
                  class="accent--text"
                  :to="{
                    path: '/settings/backup',
                    query: $store.state.routerModule.query,
                  }"
                  >download a backup copy of your settings</router-link
                >
                or add the page to your bookmarks.
              </p>
            </setup-content>
          </v-stepper>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import debounce from "lodash.debounce";
import { GETTERS, ACTIONS } from "../../store/constants";
import Draggable from "vuedraggable";
import PostButtons from "../PostButtons.vue";
import SettingsPagePreview from "./SettingsPagePreview.vue";
import SettingsSectionItem from "./SettingsSectionItem.vue";
import SettingsSectionTitle from "./SettingsSectionTitle.vue";
import SetupContent from "./SetupContent.vue";
import SetupHeader from "./SetupHeader.vue";
import TagListDisplay from "../TagListDisplay.vue";
import ColorChooser from "./ColorChooser.vue";
import BlacklistSuggestions from "../BlacklistSuggestions.vue";
import TransitionPreview from "../settings/TransitionPreview.vue";
import Logo from "../Logo.vue";
import downloadjs from "downloadjs";
import prettyBytes from "pretty-bytes";
import themes from "../../config/themes";
import { generateComputedSettings } from "../../utilities";
import transitions from "../../config/transitions.json";

export default {
  metaInfo: {
    title: "Settings",
  },
  components: {
    Draggable,
    PostButtons,
    SettingsPagePreview,
    SettingsSectionItem,
    SettingsSectionTitle,
    SetupContent,
    SetupHeader,
    Logo,
    TagListDisplay,
    ColorChooser,
    BlacklistSuggestions,
    TransitionPreview,
  },
  mounted() {
    navigator.storage.estimate().then(({ quota, usage }) => {
      this.storageUsed = usage;
      this.storageTotal = quota;
      this.storageStr = `${prettyBytes(usage)} / ${prettyBytes(quota)}`;
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.section) {
        vm.$nextTick(() => {
          setTimeout(() => {
            const match = /settings\/(.*)/.exec(from.path);
            if (match && vm.$refs && vm.$refs[match[1]]) {
              vm.$vuetify.goTo(vm.$refs[match[1]], {
                offset: -200,
                duration: 500,
                easing: "easeInOutQuint",
              });
            } else {
              vm.toTop();
            }
          }, 400);
        });
      } else {
        setTimeout(() => {
          vm.toTop();
        }, 400);
      }
      next();
    });
  },
  data() {
    return {
      storageUsed: 0,
      storageTotal: 0,
      storageStr: "",
      blacklistTable: [
        {
          name: "Dynamic",
          description:
            'uses "Tags" to hide as many posts as possible combined with "Hide" to hide the rest',
          upside:
            'You can use up to 6 regular tags and see more posts per page compared to "Hide"',
          downside:
            'You might see less posts per page than your current page size but usually more than "Hide"',
          downloads: "don't contain blacklisted posts",
        },
        {
          name: "Tags",
          description:
            'uses regular tags prefixed with " - " to blacklist posts.',
          upside:
            "You will always get the maximum number of posts per page if that many posts exist",
          downside:
            "You are limited to 6 tags (e.g. 2 normal tags + 4 blacklisted tags)",
          downloads: "don't contain blacklisted posts",
        },
        {
          name: "Hide",
          description: "hides blacklisted posts.",
          upside: "You can use up to 6 regular tags",
          downside:
            "You might see less posts per page than your current page size.",
          downloads: "don't contain blacklisted posts",
        },
        {
          name: "Blur",
          description: "shows blacklisted posts but blurs the image.",
          upside: "You can use up to 6 regular tags",
          downside:
            "You might still see a blurred version of unwanted content.",
          downloads: "contain blacklisted posts (not blurry)",
        },
        {
          name: "Blackout",
          description:
            "shows blacklisted posts but replaces the image with a black box.",
          upside: "You can use up to 6 regular tags",
          downside:
            "This might look ugly if there are many blacklisted posts on a page.",
          downloads: "contain blacklisted posts (not blacked out)",
        },
      ],
      notRecommendedRules100: [
        (v) => v < 100 || "Values over 100 may impact performance",
      ],
      backgroundItems: themes,
      compactnessItems: [
        {
          text: "More information",
          value: "more",
        },
        {
          text: "Buttons on hover (bottom)",
          value: "hover",
        },
        {
          text: "Buttons on hover (top)",
          value: "hovertop",
        },
        {
          text: "Compact",
          value: "compact",
        },
        {
          text: "Images only",
          value: "none",
        },
      ],
      fullscreenNextPreviousItems: [
        {
          text: "Always",
          value: "always",
        },
        {
          text: "While not zoomed",
          value: "zoom",
        },
        {
          text: "Never",
          value: "never",
        },
      ],
      fullscreenModeItems: [
        {
          text: "Bottom right",
          value: "br",
        },
        {
          text: "Bottom left",
          value: "bl",
        },
        {
          text: "Top left",
          value: "tl",
        },
        {
          text: "Bottom right (Card)",
          value: "brc",
        },
        {
          text: "Bottom left (Card)",
          value: "blc",
        },
        {
          text: "Top left (Card)",
          value: "tlc",
        },
      ],
      navItems: [
        {
          text: "Sidebar (with suggestions)",
          value: "sidebar",
        },
        {
          text: "Bottom",
          value: "bottom",
        },
        {
          text: "Toolbar",
          value: "toolbar",
        },
        {
          text: "Immersive",
          value: "im",
        },
      ],
      mascotItems: [
        {
          text: "Default",
          value: "default",
        },
        {
          text: "Minimal",
          value: "min",
        },
        {
          text: "Face",
          value: "face",
        },
        {
          text: "Face alternative",
          value: "facealt",
        },
        {
          text: "Hide",
          value: "hide",
        },
      ],
      apiItems: [
        {
          text: "e621.net",
          value: "e621",
        },
        {
          text: "FurryBooru (don't try, doesn't work)",
          value: "furrybooru",
        },
        {
          text: "Danbooru (don't try, doesn't work)",
          value: "danbooru",
        },
      ],
      layoutItems: [
        {
          text: "Blog view (Tumblr)",
          value: "blog",
        },
        {
          text: "Feed (Reddit, card)",
          value: "feedxl",
        },
        {
          text: "Feed (Reddit, classic)",
          value: "feedmd",
        },
        {
          text: "Feed (Reddit, compact)",
          value: "feedsm",
        },
        {
          text: "Grid (e621, small tiles)",
          value: "gridsm",
        },
        {
          text: "Grid (e621, medium tiles)",
          value: "gridmd",
        },
        {
          text: "Grid (e621, big tiles)",
          value: "gridxl",
        },
      ],
      blacklistItems: [
        {
          text: "Dynamic",
          value: "dynamic",
        },
        {
          text: "Tags (not recommended)",
          value: "tags",
        },
        {
          text: "Hide",
          value: "hide",
        },
        {
          text: "Blur",
          value: "blur",
        },
        {
          text: "Blackout",
          value: "black",
        },
      ],
    };
  },
  methods: {
    backupSettings() {
      downloadjs(
        JSON.stringify(this.$store.state.routerModule.query, null, 4),
        "material-e621-settings.json",
        "text/plain",
      );
    },
    restoreSettings(files) {
      if (!files.length) return;
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target.readyState != 2) return;
        if (event.target.error) {
          alert("Error while reading file");
          return;
        }
        try {
          const filecontent = event.target.result;
          const settings = JSON.parse(filecontent);
          this.$router.push({
            query: {
              ...this.$store.state.routerModule.query,
              ...settings,
            },
          });
          alert("Success");
        } catch (err) {
          alert(err.message || err);
        }
      };

      reader.readAsText(event.target.files[0]);
    },
    displaySetting(listOrBoolOrNumber, current) {
      if (typeof listOrBoolOrNumber == "object") {
        return (listOrBoolOrNumber.find((l) => l.value == current) || {}).text;
      }
      if (typeof listOrBoolOrNumber == "number") {
        return listOrBoolOrNumber;
      }
      return listOrBoolOrNumber ? "Enabled" : "Disabled";
    },
    toTop() {
      this.$vuetify.goTo(0, {
        offset: 0,
        duration: 500,
        easing: "easeInOutQuint",
      });
    },
    goToParser() {
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
        },
        path: "/parser",
      });
    },
    optimizeMobile() {
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
          nav: "bottom",
          fload: false,
          pagination: true,
          mobile: true,
          fpnb: "never",
          fsl: "brc",
          compactness: "compact",
        },
      });
    },
    optimizeDesktop() {
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
          layout: "blog",
          compactness: "more",
          fsl: "brc",
          btnl: "0tt_1tt_3tt_5tt_6tt_7tt_4tt",
          nav: "sidebar",
          mobile: false,
          fload: true,
          count: 100,
          aload: true,
          bload: true,
          pagination: false,
          tcount: 40,
          scount: 40,
          fpnb: "zoom",
        },
      });
    },
    optimizeDefault() {
      const query = this.$store.state.routerModule.query;
      this.$router.push({
        query: {
          blacklist: query.blacklist,
          agree: query.agree,
          fspost: query.fspost,
          tags: query.tags,
        },
      });
    },
  },
  created() {
    const pushQuery = (query) => {
      this.$router.push({
        query: {
          ...this.$store.state.routerModule.query,
          ...query,
        },
      });
    };
    this.debouncedPushQueryPost = debounce(pushQuery, 1000, {
      trailing: true,
    });
    this.debouncedPushQueryTag = debounce(pushQuery, 1000, {
      trailing: true,
    });
    this.debouncedPushQuerySuggestions = debounce(pushQuery, 1000, {
      trailing: true,
    });
  },
  computed: {
    transitionItems() {
      return Object.entries(transitions).map(([key, val]) => ({
        text: val.name,
        value: key,
      }));
    },
    ...generateComputedSettings(),
    isDarkMode: {
      get() {
        return this.$store.getters[GETTERS.CUSTOM_COLORS].dark;
      },
      set(val) {
        this.$store.dispatch(ACTIONS.SET_CUSTOM_COLORS, {
          key: "dark",
          color: val,
        });
      },
    },
    setupStep: {
      get() {
        return this.$route.params.step;
      },
      set(val) {
        this.$router.push({
          query: this.$store.state.routerModule.query,
          path: `/settings/setup/${val}`,
        });
      },
    },
    section() {
      return this.$route.params.id;
    },
    buttonLayout: {
      get() {
        return this.$store.getters[GETTERS.POST_BUTTONS_LAYOUT];
      },
      set(val) {
        this.$router.push({
          query: {
            ...this.$store.state.routerModule.query,
            btnl: val
              .map(
                (btn) =>
                  btn.id +
                  (btn.active ? "t" : "f") +
                  (btn.activeFullscreen ? "t" : "f"),
              )
              .join("_"),
          },
        });
      },
    },
    lowRes: {
      get() {
        return this.$store.getters[GETTERS.IS_LOW_RESOLUTION_MODE];
      },
      set(val) {
        let fastLoad = this.fastLoad;
        if (this.fastLoad && val) {
          fastLoad = false;
        }
        this.$router.push({
          query: {
            ...this.$store.state.routerModule.query,
            mobile: val,
            fload: fastLoad,
          },
        });
      },
    },
    fastLoad: {
      get() {
        return this.$store.getters[GETTERS.IS_FAST_LOAD_MODE];
      },
      set(val) {
        let mobile = this.lowRes;
        if (this.lowRes && val) {
          mobile = false;
        }
        this.$router.push({
          query: {
            ...this.$store.state.routerModule.query,
            fload: val,
            mobile: mobile,
          },
        });
      },
    },
  },
  name: "Settings",
};
</script>

<style lang="stylus" scoped>
.list-complete-item {
  transition: all 1s;
}

.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
}

.ghost {
  opacity: 0.3;
}

.list-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}

.file-btn {
  opacity: 0;
  position: absolute;
  height: 0;
  width: 0;
}
</style>
