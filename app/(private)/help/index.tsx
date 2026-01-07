import { CreateSupportTicketPayload } from "@/api/models/create-support-ticket-payload";
import { TicketCategory } from "@/api/models/ticket-category";
import { useMutation } from "@tanstack/react-query";
import { readAsStringAsync } from "expo-file-system/legacy";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { toast } from "sonner-native";
import { apiConfig } from "../../../api/config";
import { SupportApi } from "../../../api/endpoints/support-api";
import { ArrowBackSVG, SupportSVG } from "../../../components/icons";
import NotificationBell from "../../../components/NotificationBell";
import { useDocumentPicker } from "../../../hooks/useImagePicker";

export default function SupportScreen() {
  const [subject, setSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [message, setMessage] = useState("");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const {
    selectedImage: attachment,
    showImagePicker: handleAttachment,
    error: attachmentError,
  } = useDocumentPicker();

  const supportApi = useMemo(() => new SupportApi(apiConfig), []);

  const topics = Object.values(TicketCategory);

  // Helper to make enum values readable
  const formatTopic = (topic: string) => {
    return topic
      .replace(/_/g, " ")
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };
  const handleGoBack = () => {
    router.back();
  };

  const handleSupport = () => {
    console.log("Open support");
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setShowTopicDropdown(false);
  };

  const createTicketMutation = useMutation({
    mutationFn: (data: CreateSupportTicketPayload) => {
      return supportApi.supportTicketsPost(data);
    },
    onSuccess: () => {
      toast.success("Your message has been sent!", {
        description: "Our support team will get back to you shortly.",
      });
      router.back();
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSend = async () => {
    if (!subject.trim() || !selectedTopic || !message.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }

    let meta: CreateSupportTicketPayload["meta"] = {};

    if (attachment?.uri) {
      try {
        const base64 = await readAsStringAsync(attachment.uri, {
          encoding: "base64",
        });
        meta = {
          attachment: {
            fileName: attachment.fileName,
            base64,
          },
        };
      } catch (e) {
        toast.error("Failed to process attachment.");
        return;
      }
    }

    createTicketMutation.mutate({
      title: subject,
      description: message,
      category: selectedTopic as any, // Cast as the enum type is not available in context
      meta,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#06888C" }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowBackSVG width={30} height={30} color="white" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Support</Text>

          <View style={styles.headerActions}>
            <NotificationBell from="/(private)/help" />

            <TouchableOpacity
              onPress={handleSupport}
              style={styles.headerAction}
            >
              <SupportSVG width={24} height={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: "#FFF" }]} showsVerticalScrollIndicator={false}>
        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>We are here to help</Text>
          <Text style={styles.helpSubtitle}>
            We have an active team standing by to answer you
          </Text>
        </View>

        {/* Form Section */}
        <View style={[styles.formSection, { zIndex: 2 }]}>
          {/* Subject Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Subject</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter subject"
                placeholderTextColor="#7C8BA0"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          {/* Topic Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Topic</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setShowTopicDropdown(!showTopicDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedTopic ? styles.selectedTopicText : null,
                ]}
              >
                {selectedTopic ? formatTopic(selectedTopic) : "select"}
              </Text>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Path d="M4.5 6L8 9.5L11.5 6" stroke="black" />
              </Svg>
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showTopicDropdown && (
              <View style={styles.dropdownOptions}>
                {topics.map((topic, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownOption}
                    onPress={() => handleTopicSelect(topic)}
                  >
                    <Text style={styles.dropdownOptionText}>
                      {formatTopic(topic)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Message Field */}
          <View style={[styles.fieldContainer, { zIndex: -1 }]}>
            <Text style={styles.fieldLabel}>Message</Text>
            <View style={[styles.inputContainer, styles.messageContainer]}>
              <TextInput
                style={[styles.textInput, styles.messageInput]}
                placeholder="Add your message here..."
                placeholderTextColor="#7C8BA0"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={[styles.bottomActions, { zIndex: 1 }]}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleAttachment}
          >
            <Svg
              width="24"
              height="24"
              viewBox="0 0 24 25"
              fill={attachment ? "#06888C" : "black"}
            >
              <Path d="M7.5 18.5C6.04131 18.5 4.64236 17.9205 3.61091 16.8891C2.57946 15.8576 2 14.4587 2 13C2 11.5413 2.57946 10.1424 3.61091 9.11091C4.64236 8.07946 6.04131 7.5 7.5 7.5H18C19.0609 7.5 20.0783 7.92143 20.8284 8.67157C21.5786 9.42172 22 10.4391 22 11.5C22 12.5609 21.5786 13.5783 20.8284 14.3284C20.0783 15.0786 19.0609 15.5 18 15.5H9.5C8.83696 15.5 8.20107 15.2366 7.73223 14.7678C7.26339 14.2989 7 13.663 7 13C7 12.337 7.26339 11.7011 7.73223 11.2322C8.20107 10.7634 8.83696 10.5 9.5 10.5H17V12H9.5C9.23478 12 8.98043 12.1054 8.79289 12.2929C8.60536 12.4804 8.5 12.7348 8.5 13C8.5 13.2652 8.60536 13.5196 8.79289 13.7071C8.98043 13.8946 9.23478 14 9.5 14H18C18.3283 14 18.6534 13.9353 18.9567 13.8097C19.26 13.6841 19.5356 13.4999 19.7678 13.2678C19.9999 13.0356 20.1841 12.76 20.3097 12.4567C20.4353 12.1534 20.5 11.8283 20.5 11.5C20.5 11.1717 20.4353 10.8466 20.3097 10.5433C20.1841 10.24 19.9999 9.96438 19.7678 9.73223C19.5356 9.50009 19.26 9.31594 18.9567 9.1903C18.6534 9.06466 18.3283 9 18 9H7.5C6.43913 9 5.42172 9.42143 4.67157 10.1716C3.92143 10.9217 3.5 11.9391 3.5 13C3.5 14.0609 3.92143 15.0783 4.67157 15.8284C5.42172 16.5786 6.43913 17 7.5 17H17V18.5H7.5Z" />
            </Svg>
            <Text
              style={[
                styles.attachmentText,
                attachment ? { color: "#06888C" } : {},
              ]}
            >
              {attachment ? "Attached" : "Attachment"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={createTicketMutation.isPending}
          >
            {createTicketMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.sendText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#06888C",
    paddingTop: 20,
    paddingBottom: 19,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 21,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#FFF",
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  helpSection: {
    paddingHorizontal: 21,
    paddingTop: 18,
    gap: 7,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Raleway",
    color: "#000",
    lineHeight: 19,
  },
  helpSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#484C52",
    lineHeight: 16,
  },
  formSection: {
    paddingHorizontal: 21,
    paddingTop: 33,
    gap: 16,
  },
  fieldContainer: {
    gap: 10,
    position: "relative",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Open Sans",
    color: "#000",
  },
  inputContainer: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    backgroundColor: "#FFF",
  },
  messageContainer: {
    height: 159,
  },
  textInput: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#000",
    padding: 0,
    margin: 0,
  },
  messageInput: {
    height: 123,
    textAlignVertical: "top",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    backgroundColor: "#FFF",
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#7C8BA0",
  },
  selectedTopicText: {
    color: "#000",
  },
  dropdownOptions: {
    position: "absolute",
    top: 65,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownOptionText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#000",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 21,
    paddingTop: 38,
    paddingBottom: 40,
    gap: 6,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFF",
    gap: 8,
    flex: 1,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  attachmentText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#000",
    lineHeight: 25,
  },
  sendButton: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#06888C",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 2,
  },
  sendText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#FFF",
    lineHeight: 25,
  },
});
