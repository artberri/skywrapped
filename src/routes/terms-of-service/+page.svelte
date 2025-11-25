<script lang="ts">
	import Butterfly from '$lib/components/Butterfly.svelte';
	import Cloud from '$lib/components/Cloud.svelte';
	import { MoveLeft } from '@lucide/svelte';
</script>

<style lang="postcss">
  @reference "tailwindcss";

  h3 {
    @apply text-white/90 text-lg md:text-xl font-bold text-left mb-4;
  }

  p, li {
    @apply text-white/90 text-base text-left mb-4;
  }

  ul {
    @apply list-disc list-inside;
  }

  strong {
    @apply text-white font-bold;
  }

  a {
    @apply text-white/90;
  }
</style>

<div class="w-full h-full overflow-hidden bg-gradient-to-br from-[hsl(206,100%,50%)] to-[hsl(268,70%,65%)]">
  <div class="absolute top-10 left-10 animate-float">
    <Butterfly size="md" class="text-white/20" />
  </div>
  <div class="absolute top-20 right-20 animate-drift">
    <Cloud size="md" class="text-white/10" />
  </div>
  <div class="absolute bottom-20 left-20 animate-drift" style="animation-delay: 2s;">
    <Cloud size="md" class="text-white/10" />
  </div>
  <div class="absolute bottom-32 right-32 animate-float" style="animation-delay: 1s;">
    <Butterfly size="sm" class="text-white/20" />
  </div>

  <div class="flex flex-col items-center justify-start px-4 md:px-8">
    <div class="max-w-4xl w-full space-y-6 text-center mt-12">
      <div class="space-y-2">
        <p><a href="/" class="text-white/90 hover:text d-white">← Go back to Sky Wrapped</a></p>
        <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-left">
          Terms of Service
        </h1>
        <h2 class="text-xl md:text-2xl text-white/90 text-left">
          A few things you should know.
        </h2>
      </div>

      <p><strong>Last updated:</strong> November 25, 2025</p>

      <h3>1. Introduction</h3>

      <p>We hope you enjoy Sky Wrapped!</p>

      <p>These terms govern your use of the Sky Wrapped platform, <a href="https://skywrapped.app">https://skywrapped.app</a>,
        run by <a href="https://albertovarela.net">Alberto Varela</a> (referred to here as "we" or "us" or "Sky Wrapped").
        Please read these terms carefully, and let us know if you have any questions. By using Sky Wrapped, you agree
        to become bound by these terms.</p>

      <h3>2. Your Account</h3>

      <p>You must have a Bluesky account to use some features of Sky Wrapped; but Sky Wrapped is not affiliated with
        Bluesky or any other social media platform. We use OAuth to authenticate you with Bluesky, and we do not store
        your Bluesky credentials.</p>

      <p>All the data we collect from you is retrieved from your publicly available Bluesky account. You may ask us to
        delete any data collected from your Bluesky account at any time by emailing hello@albertovarela.net.</p>

      <p>Sky Wrapped is intended for users over the age of 16; if you are younger than this you may not use Sky Wrapped.</p>

      <p>We may restrict your access to Sky Wrapped according to its policy for handling copyright-related takedown requests,
        or if we reasonably believe that you've broken any rule in these terms.</p>

      <h3>3. Acceptable Use</h3>

      <p>You agree not to use the Service to:</p>

      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe upon the rights of others</li>
        <li>Upload, store, or share content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar,
          obscene, or otherwise objectionable</li>
        <li>Engage in spam, phishing, or other deceptive practices</li>
        <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
        <li>Interfere with or disrupt the Service or servers connected to the Service</li>
      </ul>

      <h3>4. Disclaimers</h3>

      <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied,
        and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions
        of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation
        of rights.</p>

      <p>We may link to and integrate other services run by others. We do not make any warranty about services run by others,
        or content they may provide. Use of services run by others may be governed by other terms between you and the one
        running service.</p>

      <h3>5. Content and Intellectual Property</h3>

      <p>You retain ownership of the content you upload to the Service. By uploading content, you grant us a non-exclusive,
        worldwide, royalty-free license to use, reproduce, modify, and distribute your content as necessary to provide the Service.</p>

      <h3>6. Privacy</h3>

      <p>Your privacy is important to us. Please review our <a href="/privacy-policy">Privacy Policy</a>, which also governs your use of the Service.</p>

      <h3>7. Limitation of Liability</h3>

      <p>In no event shall Sky Wrapped, nor its directors, employees, partners, agents, suppliers, or affiliates,
        be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
        loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.</p>

      <h3>8. Indemnification</h3>

      <p>You agree to indemnify and hold harmless Sky Wrapped and its licensees, licensors, contractors, and their employees,
        contractors, agents, officers and directors, from and against any and all claims and expenses, including but not
        limited to attorneys’ fees, arising from your use of the site, including but not limited to your violation of this agreement.</p>

      <p>We have not reviewed, and cannot review, all of the material, including comments, images, and files, posted to Sky Wrapped,
        and cannot therefore be responsible for that material’s content, use or effects. By operating Sky Wrapped, we do not represent
        or imply that it endorses the material there posted, or that it believes such material to be accurate, useful, or non-harmful.
        You are responsible for taking precautions as necessary to protect yourself and your computer systems from any harmful or
        destructive content. Sky Wrapped may contain content that is offensive, indecent, or otherwise objectionable, as
        well as content containing technical inaccuracies, typographical mistakes, and other errors. Sky Wrapped may also
        contain material that violates the privacy or publicity rights, or infringes the intellectual property and other
        proprietary rights, of third parties, or the downloading, copying or use of which is subject to additional terms and
        conditions, stated or unstated. We disclaim any responsibility for any harm resulting from the use by visitors of our
        Services, or from any downloading by those visitors of content there posted.</p>

      <h3>9. Governing Law</h3>

      <p>These Terms shall be interpreted and governed by the laws of Spain, without regard to its conflict of law provisions.</p>

      <h3>10. Changes to these Terms</h3>

      <p>Sky Wrapped may be modified from time to time, often without prior notice to you. Your continued use of Sky Wrapped constitutes
        your acceptance of such modifications. If you are not satisfied with a modification we make to the site,
        your sole remedy is to terminate your use of Sky Wrapped.</p>

      <p>We may on occasion make changes to our Terms and Policies. Although most changes are likely to be minor,
        we reserve the right to update or change our Terms at any time. If we make material changes to these Terms,
        we will update the changelog below. Your continued use of this site after any change in these Terms will constitute
        your consent to such change.</p>

      <p>This document is made available under a Creative Commons BY-SA License. Thanks to Leaflet, Automattic and Discourse
        for their examples.</p>

      <h3>Appendix: Changelog</h3>
      <p>November 25, 2025 – Initial version published</p>

      <div class="text-center w-full text-white/70 text-xs mb-4 pt-12">
        <a href="/terms-of-service" class="text-white/90 hover:text d-white">Terms of Service</a> and <a href="/privacy-policy" class="text-white/90 hover:text d-white">Privacy Policy</a>.
      </div>
    </div>
  </div>
</div>
