# Appium Mobile Testing Setup

## Quick Start

1. **Validate Environment**: `pnpm run test:appium:validate`
2. **Start Services**: `pnpm dev` (in one terminal), `appium --relaxed-security` (in another)
3. **Start Emulator**: `pnpm run emulator:start`
4. **Run Tests**: `pnpm run test:appium:core` (fastest) or `pnpm run test:appium` (all)

## Prerequisites

### 1. Set Environment Variables
Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

Then reload your shell:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### 2. Install Global Dependencies

```bash
# Install Appium globally
npm install -g appium

# Install Appium drivers
appium driver install uiautomator2

# Verify installation
appium-doctor --android
```

### 3. Create Android Virtual Device (AVD)
Using Android Studio or command line:
```bash
# List available system images
avdmanager list targets

# Create AVD
avdmanager create avd -n Appium_Test_Device -k "system-images;android-29;default;x86_64"
```

## Running Tests

### 1. Start Next.js Development Server
```bash
pnpm dev
```

### 2. Start Android Emulator
```bash
# Start emulator (will take 30-60 seconds to boot)
pnpm run emulator:start

# Wait for emulator to be ready
adb wait-for-device
```

### 3. Start Appium Server
In a new terminal:
```bash
appium --relaxed-security
```

### 4. Run Tests
```bash
# Run all tests
pnpm run test:appium

# Run core tests only (faster)
pnpm run test:appium:core

# Run specific test file
pnpm run test:appium -- --spec="e2e/appium/send-money.spec.js"
```

## Test Structure

Current test files:
- `send-money.spec.js` - Core send money functionality (3 tests)
- `login.spec.js` - Login form tests (2 tests)

Removed files for performance:
- `auth.spec.js`, `home.spec.js`, `register.spec.js`, `dashboard.spec.js`, `add-money.spec.js`

## Performance Optimizations

1. **Reduced test count**: Only essential tests remain
2. **Faster timeouts**: 30s max test timeout, 5s waits
3. **Minimal logging**: Only warnings and errors
4. **Optimized Chrome flags**: Disabled security, dev-shm-usage
5. **Quick auth setup**: Direct localStorage manipulation

## Troubleshooting

### Tests failing with network errors?
1. Ensure Next.js is running on port 3000
2. Check emulator can reach host: `adb shell ping 10.0.2.2`
3. Verify Appium server is running: `curl http://localhost:4723/status`

### Emulator not starting?
1. Check AVD exists: `emulator -list-avds`
2. Ensure enough disk space and RAM
3. Try with different AVD: `emulator -avd <avd-name>`

### Tests taking too long?
1. Use `test:appium:core` for fastest execution
2. Close other applications to free resources
3. Use SSD storage for better performance

## Expected Runtime
- Full test suite: ~2-3 minutes
- Core tests only: ~1-2 minutes
