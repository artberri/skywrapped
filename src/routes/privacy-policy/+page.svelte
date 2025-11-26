<script lang="ts">
	import Butterfly from '$lib/components/Butterfly.svelte';
	import Cloud from '$lib/components/Cloud.svelte';
</script>

<style lang="postcss">
  @reference "tailwindcss";

  h3 {
    @apply text-white/90 text-lg md:text-xl font-bold text-left mb-4;
  }

  h4 {
    @apply text-white/90 text-base md:text-lg font-bold text-left mb-4;
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

<svelte:head>
	<title>Privacy Policy - Sky Wrapped</title>
	<meta name="description" content="Privacy Policy for Sky Wrapped">
	<meta itemprop="name" content="Privacy Policy - Sky Wrapped">
	<meta itemprop="description" content="Privacy Policy for Sky Wrapped">
	<meta property="og:title" content="Privacy Policy - Sky Wrapped">
	<meta property="og:description" content="Privacy Policy for Sky Wrapped">
</svelte:head>

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
          Privacy Policy
        </h1>
        <h2 class="text-xl md:text-2xl text-white/90 text-left">
          Learn how we collect, use, and protect your personal information.
        </h2>
      </div>

      <p><strong>Last updated:</strong> November 25, 2025</p>

      <h3>1. Introduction</h3>

      <p>Sky Wrapped, this site, <a href="https://skywrapped.app">https://skywrapped.app</a> is run by Alberto
        Varela (referred to here as "we" or "us" or "Sky Wrapped").</p>

      <p>This Privacy Policy sets out how we collect and use any data you may provide us. By using Sky Wrapped,
        you agree to the collection and use of information in accordance with this policy.</p>

      <h3>2. Our Principles</h3>

      <p>Your privacy is critically important to us. We have a few fundamental principles:</p>

      <ul>
        <li>We collect your personal information only when we need it.</li>
        <li>We don’t share your personal information except to comply with the law, develop our products, or protect our rights.</li>
        <li>We don’t store personal information unless required for the on-going operation of our services.</li>
        <li>We make every effort to protect your privacy by using secure technology and carefully choosing trusted third-parties to work with when necessary.</li>
        <li>No spam! We’ll only send you communications about Sky Wrapped-related products and services, and we will make it easy to opt out.</li>
      </ul>

      <h3>3. Information We Collect</h3>

      <h4>Information From Bluesky</h4>

      <p>When you login with your Bluesky account, we collect:</p>

      <ul>
        <li>Your <a href="https://atproto.com/specs/did">DID</a></li>
        <li>Your chosen display name</li>
        <li>Your profile picture</li>
        <li>Your bio</li>
        <li>Your followers and following counts</li>
        <li>Your posts reposts, quotes,and replies</li>
        <li>Your likes and bookmarks</li>
      </ul>

      <p>We store:</p>

      <ul>
        <li>Your sessions in Sky Wrapped</li>
        <li>A summary of your activity in Bluesky</li>
      </ul>

      <h3>4. Data Location, Hosting and Third-Party Data Processors</h3>

      <ul>
        <li>We store the data in databases hosted in Ireland provided by <a href="https://turso.tech/">Turso</a> for the purpose
          of providing the service. Their Privacy Policy can be found <a href="https://turso.tech/privacy-policy">here</a>.</li>
        <li>We process the data in servers hosted in US East (Ohio) provided by <a href="https://www.netlify.com/">Netlify</a>
          for the purpose of providing the service. Their Privacy Policy can be found <a href="https://www.netlify.com/privacy/">here</a>.</li>
        <li>We use <a href="https://www.cloudflare.com/">Cloudflare</a> to store cookieless and anonymous analytics data
          in the United States or the European Economic Area for the purpose of improving the service. Their Privacy Policy
          can be found <a href="https://www.cloudflare.com/privacypolicy/">here</a>.</li>
      </ul>

      <h4>External PDS Notice</h4>

      <p><strong>Important:</strong> Your account is hosted on Bluesky's PDS or other self-hosted Personal Data Servers (not Sky Wrapped),
        we do not control that data. The data protection, storage location, and privacy practices for such accounts
        are governed by the respective PDS provider's policies, not this Privacy Policy. We only control data processing
        within our own services and infrastructure.</p>

      <h3>5. How We Use Your Information</h3>

      <p>We use your information to:</p>

      <ul>
        <li>Provide and maintain the Service</li>
        <li>Process your transactions and requests</li>
        <li>Improve and develop new features</li>
        <li>Ensure security and prevent fraud and abuse</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h3>6. Data Sharing and Disclosure</h3>

      <p>We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
      <ul>
        <li>With the third-party processors listed above</li>
        <li>When required by law or legal process</li>
        <li>To protect our rights, property, or safety, or that of our users</li>
        <li>In connection with a merger, acquisition, or sale of assets (with appropriate protections)</li>
      </ul>

      <h3>7. Data Security</h3>

      <p>We retain your personal information for as long as necessary to provide the Service and fulfill the purposes
        outlined in this Privacy Policy, unless a longer retention period is required by law.</p>

      <h3>8. Data Retention</h3>

      <p>We retain your personal information for as long as necessary to provide the Service and fulfill the purposes
        outlined in this Privacy Policy, unless a longer retention period is required by law.</p>

      <h3>9. Your Rights</h3>

      <p>Under applicable data protection laws, you have the right to:</p>

      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your information</li>
        <li>Object to processing of your information</li>
        <li>Request a copy of your personal information</li>
        <li>Withdraw consent (where applicable)</li>
      </ul>

      <p>To exercise these rights, please contact us at hello@albertovarela.net.</p>

      <h3>10. Cookies and Tracking</h3>

      <p>We use cookies and similar technologies to:</p>

      <ul>
        <li>Maintain your login session</li>
      </ul>

      <p>Cloudflare Web Analytics does not use any client-side state, such as cookies or localStorage,
        to collect usage metrics. We also don't "fingerprint" individuals via their IP address, User Agent
        string, or any other data for the purpose of displaying analytics.</p>

      <h3>11. Children's Privacy</h3>

      <p>The Service is not intended for children under 16 years of age. We do not knowingly collect personal
        information from children under 16. If we become aware that we have collected such information,
        we will take steps to delete it.  </p>

      <h3>12. International Data Transfers</h3>

      <p>Some of our third-party processors may process data outside the EU. When this occurs, we ensure appropriate
        safeguards are in place, such as Standard Contractual Clauses or adequacy decisions.</p>

      <h3>13. Changes to this Privacy Policy</h3>

      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
        Privacy Policy on this page and updating the "Last updated" date.</p>

      <h3>14. Contact Us</h3>

      <p>If you have any questions about this Privacy Policy or wish to exercise your rights, please contact
        us via email at hello@albertovarela.net.</p>

      <h4>This Privacy Policy complies with the EU General Data Protection Regulation (GDPR) and other applicable data protection laws.</h4>

      <div class="text-center w-full text-white/70 text-xs mb-4 pt-12">
        <a href="/terms-of-service" class="text-white/90 hover:text d-white">Terms of Service</a> and <a href="/privacy-policy" class="text-white/90 hover:text d-white">Privacy Policy</a>.
      </div>
    </div>
  </div>
</div>
