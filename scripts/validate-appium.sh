#!/bin/bash

echo "🔍 Validating Appium Test Environment..."

# Check environment variables
echo -n "✓ ANDROID_HOME: "
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ Not set. Please add to ~/.bashrc: export ANDROID_HOME=\$HOME/Android/Sdk"
    exit 1
else
    echo "✅ $ANDROID_HOME"
fi

# Check if Android SDK tools are in PATH
echo -n "✓ adb command: "
if command -v adb &> /dev/null; then
    echo "✅ Available"
else
    echo "❌ Not found. Check PATH includes \$ANDROID_HOME/platform-tools"
    exit 1
fi

echo -n "✓ emulator command: "
if command -v emulator &> /dev/null; then
    echo "✅ Available"
else
    echo "❌ Not found. Check PATH includes \$ANDROID_HOME/emulator"
    exit 1
fi

# Check if Appium is installed
echo -n "✓ appium command: "
if command -v appium &> /dev/null; then
    echo "✅ Available ($(appium --version))"
else
    echo "❌ Not found. Install with: npm install -g appium"
    exit 1
fi

# Check if AVD exists
echo -n "✓ AVD 'Appium_Test_Device': "
if emulator -list-avds | grep -q "Appium_Test_Device"; then
    echo "✅ Found"
else
    echo "❌ Not found. Create with Android Studio or avdmanager"
    exit 1
fi

# Check if Next.js is running
echo -n "✓ Next.js dev server (port 3000): "
if curl -s http://localhost:3000 &> /dev/null; then
    echo "✅ Running"
else
    echo "⚠️  Not running. Start with: pnpm dev"
fi

# Check if Appium server is running
echo -n "✓ Appium server (port 4723): "
if curl -s http://localhost:4723/status &> /dev/null; then
    echo "✅ Running"
else
    echo "⚠️  Not running. Start with: appium --relaxed-security"
fi

echo
echo "🎉 Environment validation complete!"
echo "📖 See APPIUM_TESTING_GUIDE.md for detailed setup instructions"
