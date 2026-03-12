# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview and customizable color palettes.

## Features

- **🎨 Interactive Color Wheel**: Visual color selection with an intuitive color wheel interface
- **🔄 Dual Selection Modes**:
  - **Free Selection Mode**: Manually choose two colors on the color wheel
  - **Recommendation Mode**: Select a primary color and let the system recommend the best complementary color
- **🎯 Color Harmony Algorithms**: Based on color theory including:
  - Complementary colors (互补色)
  - Analogous colors (类似色)
  - Split complementary (分裂互补色)
  - Triadic colors (三角色)
  - Tetradic colors (四角色)
  - Monochromatic (单色)
- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Custom Color Palettes**: Add up to 8 colors to create unique gradients
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Selection Features

### Color Wheel Interface
The new color wheel provides an intuitive way to select colors:
- **Visual Selection**: Click and drag on the wheel to choose colors
- **Dual Color Support**: Two color selectors on the same wheel
- **Real-time Feedback**: See color values update as you drag

### Selection Modes

#### Free Selection Mode (自由选择)
- Manually position both color selectors on the wheel
- Full control over both primary and secondary colors
- Perfect for creating custom color combinations

#### Recommendation Mode (推荐选择)
- Select your primary color on the wheel
- The system automatically recommends the best complementary color
- Algorithm considers:
  - Color brightness (light vs dark colors)
  - Saturation levels
  - Color theory principles
  - Visual contrast optimization

### Color Harmony Presets
Access various color harmony schemes:
- **Complementary**: Colors opposite on the color wheel for high contrast
- **Analogous**: Adjacent colors for harmonious blends
- **Split Complementary**: A color plus the two adjacent to its complement
- **Triadic**: Three evenly spaced colors for balanced richness
- **Tetradic**: Four colors in a rectangular arrangement
- **Monochromatic**: Variations of a single hue

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

## Testing

Run the color harmony algorithm tests:

```bash
npx ts-node src/lib/__tests__/colorHarmony.test.ts
```

The test suite validates:
- HEX to HSL color conversion
- HSL to HEX color conversion
- Color harmony generation (6 different schemes)
- Color recommendation algorithm
- Color wheel position calculations

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

## Technical Implementation

### Color Harmony Algorithm
The color recommendation system uses HSL color space calculations:

1. **Color Conversion**: HEX colors are converted to HSL for easier manipulation
2. **Harmony Calculation**: Based on hue rotation principles
   - Complementary: Hue + 180°
   - Analogous: Hue ± 30°
   - Triadic: Hue + 120°, Hue + 240°
3. **Smart Recommendation**: Considers brightness and saturation for optimal contrast

### File Structure
```
src/
├── components/
│   ├── ColorWheel.tsx      # Interactive color wheel component
│   └── ColorSelector.tsx   # Main color selection interface
├── lib/
│   ├── colorHarmony.ts     # Color theory algorithms
│   └── __tests__/
│       └── colorHarmony.test.ts  # Test suite
├── hooks/
│   └── useGradientGenerator.tsx  # Gradient generation logic
└── app/
    └── page.tsx            # Main application page
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Color Theory References

The color recommendation algorithms are based on established color theory principles:
- [Color Wheel Theory](https://en.wikipedia.org/wiki/Color_wheel)
- [Color Harmony](https://en.wikipedia.org/wiki/Harmony_(color))
- [HSL and HSV Color Models](https://en.wikipedia.org/wiki/HSL_and_HSV)
