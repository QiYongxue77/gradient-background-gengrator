# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview and customizable color palettes.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Interactive Color Wheel**: Select colors on a beautiful color wheel interface
- **Dual Selection Modes**:
  - **Free Mode**: Independently select two colors for complete creative control
  - **Recommended Mode**: Choose one color and get AI-inspired complementary color suggestions
- **Professional Color Schemes**:
  - Complementary colors (180° opposite)
  - Analogous colors (adjacent on the wheel)
  - Triadic colors (evenly spaced 120° apart)
  - Split complementary colors (adjacent to complement)
- **Custom Color Palettes**: Add up to 8 colors to create unique gradients
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

## Using the Color Wheel

### Free Selection Mode
1. Click on "Free" mode in the color wheel section
2. Drag the two handles on the color wheel to select your desired colors
3. You can also use the color pickers or enter hex codes directly
4. The gradient preview updates in real-time as you make changes

### Recommended Selection Mode
1. Click on "Recommended" mode in the color wheel section
2. Select your primary color using the color wheel, color picker, or hex code
3. The application will automatically suggest the best complementary color
4. Explore different color scheme recommendations:
   - **Complementary**: High contrast, vibrant pairing
   - **Analogous**: Harmonious, adjacent colors
   - **Triadic**: Three evenly spaced colors
   - **Split Complementary**: Balanced contrast

## Testing

### Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application in action.

### Run Tests
We use Vitest for testing. Run all tests with:

```bash
npm run test:run
```

For interactive watch mode (re-runs tests on file changes):

```bash
npm test
```

For a beautiful UI to visualize test results:

```bash
npm run test:ui
```

### What's Tested
The test suite verifies:
- ✅ Color conversion accuracy (RGB ↔ HSL ↔ Hex)
- ✅ Complementary color generation (180° apart)
- ✅ Analogous color generation (±30°)
- ✅ Triadic color generation (120° spacing)
- ✅ Split complementary color generation
- ✅ Recommended color scheme generation
- ✅ Best color pair selection (including adjustments for very light/dark colors)

## Color Theory Implementation

### Algorithms Used

1. **Complementary Colors**: Colors opposite each other on the wheel (180° difference)
2. **Analogous Colors**: Colors adjacent to each other (±30°)
3. **Triadic Colors**: Three colors forming an equilateral triangle (120° apart)
4. **Split Complementary**: Uses colors adjacent to the complement (150° and 210°)
5. **Monochromatic**: Variations of the same hue with different lightness

### Best Pair Selection
The algorithm intelligently selects the best complementary color by:
- Using the true complementary color for most cases
- Adjusting for very light colors (>85% lightness) by pairing with a dark version
- Adjusting for very dark colors (<15% lightness) by pairing with a light version

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
