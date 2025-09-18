import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { ChevronDown, ChevronRight, Globe, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import logo from "@/assets/mediplusLogo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { applyLanguage } from "@/lib/translation";
import { toast } from "@/components/ui/use-toast";

const linkBase =
  "text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap";
const active = "text-primary";

const LANGS = [
  { label: "English", code: "en" },
  { label: "Malay", code: "ms" },
  { label: "Indonesian", code: "id" },
  { label: "Tamil", code: "ta" },
  { label: "Chinese", code: "zh" },
  { label: "Vietnamese", code: "vi" },
  { label: "Tagalog", code: "tl" },
  { label: "Thai", code: "th" },
  { label: "Burmese", code: "my" },
  { label: "Khmer", code: "km" },
  { label: "Lao", code: "lo" },
];

const NAV_ITEMS = [
  { label: "Home", to: "/home" },
  { label: "Mood Tracker", to: "/moodtracker" },
  { label: "Journal", to: "/journal" },
  { label: "Overview", to: "/MentalHealthOverview" },
  { label: "MindfulBot", to: "/mindfulbot" },
  { label: "Resources", to: "/resources" },
  { label: "Questions for Doctor", to: "/questions" },
  { label: "Future Expansions", to: "/future-expansions", isDropdown: true },
];

const Navigation = () => {
  const location = useLocation();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [loading, setLoading] = useState(false);

  // keep <html lang> in sync
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [location.pathname, lang]);

  const handleLanguage = async (code: string, label: string) => {
    setLoading(true);
    toast({
      title: "Translating…",
      description: `Switching to ${label}`,
    });

    try {
      setLang(code);
      await applyLanguage(code);
      toast({
        title: "Done ✅",
        description: `Language changed to ${label}`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Translation failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const healthMenuItems = [
    { title: "Vitals", description: "Track vital signs", to: "/vitals" },
    { title: "Medication", description: "Manage your medications", to: "/medication" },
    { title: "Health Overview", description: "Your complete health dashboard", to: "/HealthOverview" },
    { title: "MedBot", description: "AI-powered medical assistance", to: "/medbot" },
  ];

  const itemHover =
    "hover:bg-purple-100/70 hover:text-purple-900 " +
    "focus:bg-purple-100/70 focus:text-purple-900 " +
    "data-[highlighted]:bg-purple-100 data-[highlighted]:text-purple-900";

  // 🔑 Dynamic nav handling
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(NAV_ITEMS);
  const [overflowItems, setOverflowItems] = useState<typeof NAV_ITEMS>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateLayout = () => {
      const containerWidth = container.offsetWidth;
      let totalWidth = 0;
      const newVisible: typeof NAV_ITEMS = [];
      const newOverflow: typeof NAV_ITEMS = [];

      NAV_ITEMS.forEach((item) => {
        // create a temp span to measure width
        const temp = document.createElement("span");
        temp.className = "font-medium whitespace-nowrap px-2";
        temp.style.visibility = "hidden";
        temp.style.position = "absolute";
        temp.innerText = item.label;
        document.body.appendChild(temp);
        const itemWidth = temp.offsetWidth + 40; // extra padding + gap
        document.body.removeChild(temp);

        if (totalWidth + itemWidth < containerWidth - 200) {
          newVisible.push(item);
          totalWidth += itemWidth;
        } else {
          newOverflow.push(item);
        }
      });

      setVisibleItems(newVisible);
      setOverflowItems(newOverflow);
    };

    calculateLayout();

    const observer = new ResizeObserver(() => calculateLayout());
    observer.observe(container);

    return () => observer.disconnect();
  }, []);


  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-[95%] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo (static) */}
          <div className="flex items-center flex-shrink-0 mr-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg overflow-hidden">
                <img src={logo} alt="MediPlus logo" className="w-full h-full object-contain" />
              </div>
              <span
                className="text-xl font-bold text-primary"
                data-i18n-skip="true"
              >
                MediPlus
              </span>
            </Link>
          </div>

          {/* Center: Dynamic Nav (with More dropdown) */}
          <div
            className="hidden md:flex items-center space-x-6 flex-1 justify-center overflow-hidden"
            ref={containerRef}
          >
            {visibleItems.map((item) =>
              item.isDropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap min-w-[120px]">
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="nav-dropdown w-72">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <DropdownMenuItem className={`p-3 rounded-md flex flex-col ${itemHover}`}>
                          <div className="relative w-full flex items-center justify-center">
                            <span className="font-semibold text-foreground text-base text-center">Health</span>
                            <ChevronRight className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2" />
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 whitespace-normal leading-snug text-center w-full">
                            Track vitals, meds, and your health dashboard
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="ml-0 w-64">
                        {healthMenuItems.map((h) => (
                          <DropdownMenuItem key={h.title} asChild>
                            <Link to={h.to} className={`p-3 rounded-md flex flex-col text-left ${itemHover}`}>
                              <div className="font-semibold text-foreground text-base">{h.title}</div>
                              <div className="text-sm text-muted-foreground mt-1 whitespace-normal leading-snug">{h.description}</div>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="border-t my-2" />
                    <DropdownMenuItem asChild>
                      <Link to="/exercise" className={`p-3 rounded-md flex flex-col ${itemHover}`}>
                        <div className="flex items-center justify-center w-full">
                          <span className="font-semibold text-foreground text-base">Exercise & Wellness</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 whitespace-normal leading-snug text-center w-full">
                          Stay active and track your wellness
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [linkBase, isActive ? active : "", item.label === "Home" ? "px-2" : ""].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}

            {overflowItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center space-x-1 text-foreground hover:text-primary font-medium whitespace-nowrap min-w-[100px]"
                    data-i18n-skip="true"
                  >
                    <span data-i18n-skip="true">More</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown w-64">
                  {overflowItems.map((item) =>
                    item.isDropdown ? (
                      <DropdownMenu key={item.label}>
                        <DropdownMenuTrigger asChild>
                          <DropdownMenuItem className="flex items-center justify-between w-full">
                            <span>{item.label}</span>
                            <ChevronRight className="w-4 h-4" />
                          </DropdownMenuItem>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-72">
                          {/* Health Submenu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <DropdownMenuItem className={`p-3 rounded-md flex flex-col ${itemHover}`}>
                                <div className="relative w-full flex items-center justify-center">
                                  <span className="font-semibold text-foreground text-base text-center">
                                    Health
                                  </span>
                                  <ChevronRight className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 whitespace-normal leading-snug text-center w-full">
                                  Track vitals, meds, and your health dashboard
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" className="w-64">
                              {healthMenuItems.map((h) => (
                                <DropdownMenuItem key={h.title} asChild>
                                  <Link
                                    to={h.to}
                                    className={`p-3 rounded-md flex flex-col text-left ${itemHover}`}
                                  >
                                    <div className="font-semibold text-foreground text-base">
                                      {h.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1 whitespace-normal leading-snug">
                                      {h.description}
                                    </div>
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <div className="border-t my-2" />
                          <DropdownMenuItem asChild>
                            <Link
                              to="/exercise"
                              className={`p-3 rounded-md flex flex-col ${itemHover}`}
                            >
                              <div className="flex items-center justify-center w-full">
                                <span className="font-semibold text-foreground text-base">
                                  Exercise & Wellness
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1 whitespace-normal leading-snug text-center w-full">
                                Stay active and track your wellness
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <DropdownMenuItem key={item.to} asChild>
                        <NavLink to={item.to} className="w-full whitespace-nowrap">
                          {item.label}
                        </NavLink>
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>  

          {/* Right: Languages + User Profile (static) */}
          <div className="flex items-center space-x-4 flex-shrink-0 ml-6">
            {/* Languages dropdown (skip translation) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="hidden sm:flex items-center"
                  data-i18n-skip="true"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span data-i18n-skip="true">Languages</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                  {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-primary" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="nav-dropdown w-35" data-i18n-skip="true">
                {LANGS.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    disabled={loading}
                    className={`py-2 px-3 text-left whitespace-nowrap rounded-md ${itemHover} ${
                      loading ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={() => handleLanguage(l.code, l.label)}
                    data-i18n-skip="true"
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile (skip translation for name) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
                  <User className="w-5 h-5" />
                  <span
                    className="hidden sm:block font-medium whitespace-nowrap"
                    data-i18n-skip="true"
                  >
                    Bella Swan
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="nav-dropdown w-38">
                <DropdownMenuItem className={`p-3 rounded-md ${itemHover}`}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 rounded-md ${itemHover}`} asChild>
                  <Link to="/home">Health Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 rounded-md ${itemHover}`}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
