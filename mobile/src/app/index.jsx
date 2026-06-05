import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ERAS, TIMELINE_EVENTS, DINO_IMAGES } from '../data/dinosaurEras';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Verified Sketchfab public model IDs
const SKETCHFAB = {
  "Tyrannosaurus Rex": "e18c433cdd1c49f8ac152348b7384037",
  "Triceratops": "909bf645de1746829ab19acd1ae31767",
  "Velociraptor": "8f1744af7b0847a2aabe3df90be802f0",
  "Spinosaurus": "d98b4f7dcf6d40b8b1f0b5523b3f551a",
  "Ankylosaurus": "8f249e802fc94e9098ad902d33a670bf",
  "Pteranodon": "144d0f815d5341bba6de95786a1b9343",
  "Mosasaurus": "83338897566c4288a8e5f10db623ff18",
  "Pachycephalosaurus": "6eea5cee4afa4730bf75c6329a43e56d",
  "Brachiosaurus": "641feb1a485b492c8de31e84ff89ad64",
  "Stegosaurus": "6e9a2f36f0a447758d71c2134512580e",
  "Allosaurus": "9bd8f994a98a448792a188e305d6bd59",
  "Diplodocus": "1d07ae9e002f4e8ab930dc92d07eb078",
  "Archaeopteryx": "cae0cdf2206c4e869b15032f06d6b46f",
  "Compsognathus": "f6e2f391d2de43db95ec15f674cb1d30",
  "Eoraptor": "ef6e5b69a9db47639991b9a9116e4277",
  "Coelophysis": "c8fee7a21dbc465d8fae98a0df4d190e",
  "Plateosaurus": "80683eb568cc46caac0649e395fa5a1b"
};

export default function Index() {
  const [activeEra, setActiveEra] = useState(0);
  const [activeTab, setActiveTab] = useState('species'); // 'species' or 'timeline'
  const [viewer3D, setViewer3D] = useState(null);
  const [loading3D, setLoading3D] = useState(true);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (viewer3D) {
      setLoading3D(true);
    }
  }, [viewer3D]);

  const era = ERAS[activeEra];
  const accentColor = era.color;

  const handleScrollToSection = (tabName) => {
    setActiveTab(tabName);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#080B04" />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.logoText}>🦕 AIM Centre 360</Text>
          <Text style={styles.taglineText}>AIM High, Achieve Infinity</Text>
        </View>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'species' && { borderBottomColor: accentColor }]}
            onPress={() => handleScrollToSection('species')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'species' && { color: accentColor }]}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'timeline' && { borderBottomColor: accentColor }]}
            onPress={() => handleScrollToSection('timeline')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'timeline' && { color: accentColor }]}>Timeline</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {activeTab === 'species' ? (
          <>
            {/* Era Overview Banner */}
            <LinearGradient
              colors={['rgba(212,168,83,0.05)', '#080B04']}
              style={styles.heroBanner}
            >
              <Text style={styles.heroSub}>EXPLORE NATURAL HISTORY</Text>
              <Text style={styles.heroTitle}>Age of Dinosaurs</Text>
              <Text style={styles.heroDesc}>
                A journey through 186 million years of dinosaur evolution, from the Triassic dawn to the Cretaceous twilight.
              </Text>
            </LinearGradient>

            {/* Era Selector Buttons */}
            <View style={styles.eraButtonsContainer}>
              {ERAS.map((e, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveEra(i)}
                  style={[
                    styles.eraButton,
                    activeEra === i
                      ? { backgroundColor: e.bg, borderColor: e.color }
                      : { borderColor: 'rgba(255, 255, 255, 0.08)' }
                  ]}
                >
                  <Text style={[styles.eraButtonPeriod, { color: e.color }]}>{e.period.split(' ')[0]}</Text>
                  <Text style={styles.eraButtonName}>{e.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Selected Era Details Card */}
            <View style={[styles.eraDetailsCard, { borderColor: accentColor + '30', backgroundColor: era.bg }]}>
              <Text style={[styles.eraDetailsPeriod, { color: accentColor }]}>{era.period} · ERA DETAILS</Text>
              <Text style={styles.eraDetailsTitle}>The {era.name} Period</Text>
              <Text style={styles.eraDetailsDesc}>{era.desc}</Text>
              
              <View style={styles.eraDetailsStat}>
                <Text style={[styles.eraDetailsStatLabel, { color: accentColor }]}>KEY EVOLUTIONARY MILESTONE</Text>
                <Text style={styles.eraDetailsStatValue}>{era.keyEvent}</Text>
              </View>
            </View>

            {/* Species Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{era.name} Species</Text>
              <View style={[styles.divider, { backgroundColor: accentColor }]} />
            </View>

            {/* Dinosaur Cards */}
            <View style={styles.speciesList}>
              {era.dinos.map((dino, idx) => (
                <View key={dino.name} style={[styles.dinoCard, { borderColor: 'rgba(255,255,255,0.08)' }]}>
                  <View style={styles.dinoImageContainer}>
                    <Image source={DINO_IMAGES[dino.name]} style={styles.dinoImage} />
                    <LinearGradient
                      colors={['transparent', '#0a0f05']}
                      style={styles.imageOverlay}
                    />
                    <View style={styles.badgeContainer}>
                      <Text style={[styles.badgeText, { color: dino.badgeColor, backgroundColor: dino.badgeColor + '20', borderColor: dino.badgeColor + '50' }]}>
                        {dino.badgeText}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dinoCardContent}>
                    <Text style={styles.dinoName}>{dino.name}</Text>
                    <Text style={styles.dinoLatin}>{dino.latin}</Text>

                    {/* Quick Stats Grid */}
                    <View style={styles.statsGrid}>
                      <View style={styles.statBox}>
                        <Text style={[styles.statLabel, { color: accentColor }]}>Length</Text>
                        <Text style={styles.statValue}>{dino.length}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={[styles.statLabel, { color: accentColor }]}>Weight</Text>
                        <Text style={styles.statValue}>{dino.weight}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={[styles.statLabel, { color: accentColor }]}>Diet</Text>
                        <Text style={styles.statValue}>{dino.diet}</Text>
                      </View>
                    </View>

                    <Text style={styles.dinoDesc}>{dino.desc}</Text>

                    {/* View in 3D Button */}
                    <TouchableOpacity
                      onPress={() => setViewer3D({ name: dino.name, id: SKETCHFAB[dino.name] })}
                      style={[styles.btn3D, { borderColor: accentColor + '60', backgroundColor: accentColor + '15' }]}
                    >
                      <Ionicons name="cube-outline" size={14} color={accentColor} style={{ marginRight: 6 }} />
                      <Text style={[styles.btn3DText, { color: accentColor }]}>VIEW IN 3D</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          /* Timeline Tab View */
          <View style={styles.timelineSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AIM Chronology Timeline</Text>
              <View style={[styles.divider, { backgroundColor: '#E4A853' }]} />
              <Text style={styles.sectionSubtitle}>252 – 60 Million Years Ago</Text>
            </View>

            <View style={styles.timelineContainer}>
              {/* Vertical timeline center line */}
              <View style={styles.timelineLine} />

              <View style={styles.timelineList}>
                {TIMELINE_EVENTS.map((event, idx) => {
                  const isDino = event.type === 'dinosaur';
                  const dino = isDino ? ERAS.flatMap(e => e.dinos).find(d => d.name === event.dinoName) : null;
                  const eraName = isDino ? ERAS.find(e => e.dinos.some(d => d.name === event.dinoName))?.name : '';

                  return (
                    <View key={idx} style={styles.timelineItem}>
                      {/* Left timeline node indicator */}
                      <View style={[styles.timelineNode, { borderColor: event.color }]} />

                      <View style={styles.timelineContentCard}>
                        {isDino && dino ? (
                          /* Dinosaur timeline card */
                          <View style={styles.timelineDinoCard}>
                            <View style={styles.timelineDinoHeader}>
                              <Image source={DINO_IMAGES[dino.name]} style={styles.timelineDinoThumb} />
                              <View style={styles.timelineDinoText}>
                                <Text style={[styles.timelineEventMya, { color: event.color }]}>
                                  {event.mya} MYA · {eraName}
                                </Text>
                                <Text style={styles.timelineDinoName}>{dino.name}</Text>
                                <Text style={styles.timelineDinoLatin}>{dino.latin}</Text>
                              </View>
                            </View>
                            <Text style={styles.timelineDinoDesc} numberOfLines={2}>{dino.desc}</Text>
                            <View style={styles.timelineDinoFooter}>
                              <Text style={styles.timelineDinoDiet}>Diet: {dino.diet}</Text>
                              <TouchableOpacity
                                onPress={() => setViewer3D({ name: dino.name, id: SKETCHFAB[dino.name] })}
                                style={styles.timelineDinoBtn}
                              >
                                <Text style={[styles.timelineDinoBtnText, { color: event.color }]}>View 3D →</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          /* Geological milestone card */
                          <View style={styles.timelineGeoCard}>
                            <Text style={[styles.timelineEventMya, { color: event.color }]}>
                              {event.mya} MYA
                            </Text>
                            <Text style={styles.timelineGeoText}>{event.event}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🦕 AIM CENTRE 360</Text>
          <Text style={styles.footerTagline}>AIM High, Achieve Infinity</Text>
          <Text style={styles.footerText}>
            Content compiled from peer-reviewed paleontological research.
          </Text>
        </View>

      </ScrollView>

      {/* 3D WebView Viewer Modal */}
      {viewer3D && (
        <Modal
          visible={!!viewer3D}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setViewer3D(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalSub}>INTERACTIVE 3D MODEL</Text>
                  <Text style={styles.modalTitle}>{viewer3D.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setViewer3D(null)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              {/* WebView containing the Sketchfab embed */}
              <View style={styles.webviewContainer}>
                {loading3D && (
                  <View style={styles.webviewLoader}>
                    <ActivityIndicator size="large" color="#D4A853" />
                    <Text style={styles.loaderText}>Loading Interactive 3D Model...</Text>
                  </View>
                )}
                <WebView
                  style={styles.webview}
                  source={{
                    uri: `https://sketchfab.com/models/${viewer3D.id}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_hint=1&double_click=0`
                  }}
                  onLoadEnd={() => setLoading3D(false)}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  scrollEnabled={false}
                />
              </View>

              {/* Interaction Guide */}
              <View style={styles.modalFooter}>
                <Text style={styles.modalFooterText}>
                  Drag to rotate · Pinch to zoom · Two fingers to pan
                </Text>
              </View>

            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#080B04',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: 'rgba(8, 11, 4, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  headerTitleContainer: {
    marginBottom: 8,
  },
  logoText: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A853',
  },
  taglineText: {
    fontSize: 10,
    color: '#999',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 6,
  },
  tabButton: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonText: {
    color: '#888',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroBanner: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  heroSub: {
    color: '#D4A853',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroDesc: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.85,
  },
  eraButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  eraButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  eraButtonPeriod: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  eraButtonName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  eraDetailsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  eraDetailsPeriod: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  eraDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  eraDetailsDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#ccc',
  },
  eraDetailsStat: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
  },
  eraDetailsStatLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  eraDetailsStatValue: {
    fontSize: 12,
    color: '#eee',
    marginTop: 4,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 1.5,
  },
  divider: {
    width: 60,
    height: 2,
    marginTop: 8,
    borderRadius: 1,
  },
  speciesList: {
    paddingHorizontal: 16,
    gap: 24,
  },
  dinoCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dinoImageContainer: {
    height: 180,
    position: 'relative',
    backgroundColor: '#050702',
  },
  dinoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    letterSpacing: 1,
  },
  dinoCardContent: {
    padding: 16,
  },
  dinoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dinoLatin: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ddd',
    marginTop: 2,
  },
  dinoDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#aaa',
  },
  btn3D: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  btn3DText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timelineSection: {
    paddingVertical: 12,
  },
  timelineContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  timelineLine: {
    position: 'absolute',
    left: 21,
    top: 6,
    bottom: 6,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  timelineList: {
    gap: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'flex-start',
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    backgroundColor: '#080B04',
    marginTop: 12,
    zIndex: 10,
  },
  timelineContentCard: {
    flex: 1,
    marginLeft: 16,
  },
  timelineGeoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  timelineEventMya: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  timelineGeoText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
    marginTop: 4,
  },
  timelineDinoCard: {
    backgroundColor: 'rgba(212,168,83,0.03)',
    borderColor: 'rgba(212,168,83,0.15)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  timelineDinoHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDinoThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#050702',
  },
  timelineDinoText: {
    flex: 1,
    justifyContent: 'center',
  },
  timelineDinoName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  timelineDinoLatin: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  timelineDinoDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: '#aaa',
    marginTop: 8,
  },
  timelineDinoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 8,
  },
  timelineDinoDiet: {
    fontSize: 10,
    color: '#777',
  },
  timelineDinoBtn: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  timelineDinoBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4A853',
  },
  footerTagline: {
    fontSize: 8,
    color: '#777',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  footerText: {
    color: '#444',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: '#0a0e06',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalSub: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#D4A853',
    letterSpacing: 2,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#111',
  },
  webviewLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderText: {
    color: '#999',
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 1,
  },
  webview: {
    flex: 1,
  },
  modalFooter: {
    paddingVertical: 10,
    backgroundColor: '#080B04',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  modalFooterText: {
    fontSize: 10,
    color: '#555',
  },
});