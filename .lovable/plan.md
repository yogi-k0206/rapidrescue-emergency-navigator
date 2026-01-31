

# 🚑 RapidRescue - Smart Emergency Traffic & Hospital Navigation System

## Overview
A polished hackathon demo showcasing an emergency ambulance navigation system with real-time map visualization, multiple user roles, and emergency vehicle authorization - all pre-loaded with Bangalore, India data.

---

## 🎨 Design System

**Color Palette:**
- **Emergency Red** (`#DC2626`) - Alerts, urgent actions, emergency mode
- **Medical Blue** (`#2563EB`) - Headers, primary actions, trust indicators
- **Clean White** (`#FFFFFF`) - Backgrounds, cards
- **Success Green** (`#16A34A`) - Available status, clear routes
- **Warning Amber** (`#F59E0B`) - Moderate traffic, pending status

**Typography:** Clean, bold headings with Inter/system fonts for maximum readability

**UI Style:** Modern, card-based layout with subtle shadows, rounded corners, and smooth micro-animations

---

## 📱 Pages & Features

### 1. **Landing / Role Selector**
A professional entry point showcasing the RapidRescue brand with role selection:
- Large animated ambulance/emergency icon
- Four role cards to choose from:
  - 🚑 Ambulance Driver
  - 🚗 Temporary Emergency Vehicle
  - 👮 Police Control Room
  - 🏥 Hospital Staff
- Click any role to enter that dashboard (demo mode)

---

### 2. **Ambulance Dashboard**
The primary view for ambulance personnel:

**Header Section:**
- RapidRescue logo + ambulance registration number (KA-01-AB-1234)
- Current emergency status indicator (Active/Standby)
- Quick patient status toggle

**Left Panel - Details:**
- Ambulance details card (vehicle info, driver name, contact)
- Assigned hospital card (Manipal Hospital, Bangalore)
- Distance & ETA display
- Patient registration status (✅ Registered / ⏳ Pending)

**Right Panel - Live Map:**
- Full-height interactive OpenStreetMap/Leaflet map
- Current ambulance location marker
- Route to destination with traffic overlay simulation
- Nearby hospitals marked with availability indicators
- Color-coded route (green = clear, yellow = moderate, red = heavy traffic)

**Bottom Bar:**
- "Start Navigation" button
- Emergency broadcast toggle
- Quick hospital switch dropdown

---

### 3. **Temporary Emergency Vehicle Mode**
For auto-rickshaws or other vehicles requesting emergency authorization:

**Request Flow:**
1. Vehicle registration entry form
2. Reason for emergency (dropdown: Ambulance unavailable, Medical emergency, etc.)
3. Auto-detected nearest hospitals (locked destinations only)
4. Submit request → Simulated police approval (2-3 second animation)

**Active Emergency Mode Dashboard:**
- Prominent "EMERGENCY MODE ACTIVE" banner with countdown timer
- Locked destination hospital display
- Same map view as ambulance with restricted routing
- Clear restrictions shown:
  - ✅ Signal bypass authorized
  - ✅ Emergency speed permitted
  - 🔒 Destination locked to verified hospital
  - ⏱️ Time-limited (30 min countdown)
- "End Emergency Mode" button

---

### 4. **Police Control Room Dashboard**
Read-only monitoring view for authorities:

**Overview Panel:**
- Total active ambulances count
- Active temporary emergency vehicles count
- Resolved emergencies today

**Live Tracking Table:**
| Vehicle | Type | Status | Route | Destination | ETA |
|---------|------|--------|-------|-------------|-----|
| KA-01-AB-1234 | Ambulance | Active | Indiranagar → Manipal | Manipal Hospital | 8 min |
| KA-05-CD-5678 | Temp Emergency | Active | Koramangala → St. John's | St. John's Hospital | 12 min |

**Full Map View:**
- All active emergency vehicles on one map
- Click any vehicle to see details
- Filter by vehicle type

---

### 5. **Hospital View**
Simple dashboard for hospital staff:

**Incoming Emergencies:**
- List of ambulances en route to this hospital
- Patient pre-registration forms
- ETA countdown for each incoming vehicle

**Verification Panel:**
- Verify/confirm emergency vehicle arrivals
- Mark patient as "Received"

---

## 🗺️ Map Features

**Using Leaflet + OpenStreetMap (Free, no API key):**
- Interactive pan/zoom map centered on Bangalore
- Custom markers for:
  - 🚑 Ambulances (animated pulse effect)
  - 🏥 Hospitals (with availability color)
  - 🚗 Temporary emergency vehicles
- Simulated traffic overlay (colored route segments)
- Route drawing with turn-by-turn preview
- Responsive map that works on mobile

---

## 📊 Pre-loaded Demo Data (Bangalore)

**5 Sample Hospitals:**
1. Manipal Hospital, Old Airport Road
2. St. John's Medical College Hospital
3. Apollo Hospital, Bannerghatta Road
4. Fortis Hospital, Cunningham Road
5. Narayana Health City, Bommasandra

**3 Sample Ambulances:**
- KA-01-AB-1234 (Active, en route to Manipal)
- KA-02-CD-5678 (Standby at Koramangala)
- KA-03-EF-9012 (Active, en route to Apollo)

**1 Sample Temporary Emergency:**
- Auto-rickshaw converted, heading to St. John's

---

## 🎬 Demo Flow for Hackathon

**Suggested presentation order:**
1. Start at Role Selector → Choose "Ambulance Driver"
2. Show live map with route, hospital info, patient status
3. Switch to "Temporary Emergency Vehicle" → Show request flow & restrictions
4. Switch to "Police Control Room" → Show monitoring all vehicles
5. Switch to "Hospital View" → Show incoming ambulance list

---

## 📱 Responsive Design

- **Desktop:** Side-by-side panels + large map
- **Tablet:** Stacked cards with medium map
- **Mobile:** Full-width cards, swipeable sections, map takes priority

---

## ✨ Polish & Animations

- Smooth page transitions between roles
- Pulsing effect on active ambulance markers
- Loading shimmer during "police approval" simulation
- Toast notifications for status changes
- Countdown animations for time-limited emergency mode

