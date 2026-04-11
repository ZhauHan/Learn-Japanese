import random

def prepare_kanas() -> dict[str, str]:
  hiragana_d = {}
  katakana_d = {}
  with open("./Kanas/Hiragana.txt", "r", encoding='utf-8') as file:
    for line in file:
      value, key = line.split()
      hiragana_d[key] = value
  with open("./Kanas/Katakana.txt", "r", encoding='utf-8') as file:
    for line in file:
      value, key = line.split()
      katakana_d[key] = value
  return hiragana_d, katakana_d


    
if __name__ == "__main__":
  hiragana, katakana = prepare_kanas()
  # since they both have the same keys, we can use either one
  kanas = hiragana
  
  invalid_input = True
  
  while invalid_input:
    # validate user input
    invalid_input = False
    quiz_choice = input("Welcome to the Kana Quiz! Enter 1) for hiragana, 2) for katakana, 3) for both: ")
    quiz_length = int(input("Enter the number of questions you want: "))
    keys = list(kanas.keys())
    
    if quiz_length > len(kanas.keys()) or quiz_length < 1:
      print("Invalid number of questions. Please try again.")
      invalid_input = True
      quiz_choice = 0
    
    #hiragana quiz
    keys = random.sample(keys, quiz_length)
    answers = []
    if quiz_choice == "1" or quiz_choice =="2":
      for i in range(quiz_length):
        random_key = keys[i]
        print(f"Question {i+1}: {random_key}")
        
        if quiz_choice == "1":
          answers.append(hiragana[keys[i]])
        elif quiz_choice == "2":
          answers.append(katakana[keys[i]])
    
    elif quiz_choice == "3":
      for i in range(quiz_length):
        random_kana = random.choice([['hiragana', hiragana], ['katakana' ,katakana]])
        random_key = keys[i]
        print(f"Question {i+1}: {random_key} ({random_kana[0]})")
   
        answers.append(random_kana[1][keys[i]])
    else:
      print("Invalid choice. Please try again.")
      invalid_input = True
      
    input = input("Plese write your answers and press enter to see the results: ")
      
    for i, ans in enumerate(answers):
      print(f"Question {i+1}: {ans}")
  

  